import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import pool from "../pool";

const router = express.Router();
const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

router.post("/", async (req: Request, res: Response) => {
  const insuranceApplication = req.body as InsuranceApplication;

  if (insuranceApplication.dateOfBirth) {
    const date = new Date(insuranceApplication.dateOfBirth);
    date.setUTCHours(12, 0, 0, 0);
    insuranceApplication.dateOfBirth = date;
  }

  if (insuranceApplication.people) {
    insuranceApplication.people = insuranceApplication.people.map((person) => {
      if (person.dateOfBirth) {
        const date = new Date(person.dateOfBirth);
        date.setUTCHours(12, 0, 0, 0);
        return { ...person, dateOfBirth: date };
      }
      return { ...person };
    });
  }

  const validator = new InsuranceApplicationValidator(insuranceApplication);
  const validationErrors = validator.validateCompleteApplication();

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      applicationId,
      firstName,
      lastName,
      dateOfBirth,
      addressStreet,
      addressCity,
      addressState,
      addressZipCode,
      people,
      vehicles,
    } = insuranceApplication;

    const checkSql = `SELECT id FROM applications WHERE applicationId = ?`;
    const [existingApplication] = await connection.execute(checkSql, [
      applicationId,
    ]);

    if ((existingApplication as any[]).length > 0) {
      const updateSql = `
        UPDATE applications
        SET firstName = ?, lastName = ?, dateOfBirth = ?, addressStreet = ?, addressCity = ?,
            addressState = ?, addressZipCode = ?
        WHERE applicationId = ?
      `;
      const updateParams = [
        firstName,
        lastName,
        dateOfBirth,
        addressStreet,
        addressCity,
        addressState,
        addressZipCode,
        applicationId,
      ];
      await connection.execute(updateSql, updateParams);

      // Delete existing people and vehicles to ensure new data replaces old data
      const deletePeopleSql = `DELETE FROM people WHERE applicationId = ?`;
      await connection.execute(deletePeopleSql, [applicationId]);

      const deleteVehiclesSql = `DELETE FROM vehicles WHERE applicationId = ?`;
      await connection.execute(deleteVehiclesSql, [applicationId]);
    } else {
      // Insert a new application
      const insertSql = `
        INSERT INTO applications (
          applicationId, firstName, lastName, dateOfBirth, addressStreet, addressCity, addressState, addressZipCode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertParams = [
        applicationId,
        firstName,
        lastName,
        dateOfBirth,
        addressStreet,
        addressCity,
        addressState,
        addressZipCode,
      ];

      await connection.execute(insertSql, insertParams);
    }

    // Insert or re-insert the primary person
    const primaryPersonSql = `
      INSERT INTO people (
        applicationId, firstName, lastName, dateOfBirth, relationship
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const primaryPersonParams = [
      applicationId,
      firstName,
      lastName,
      dateOfBirth,
      "Primary Applicant",
    ];
    await connection.execute(primaryPersonSql, primaryPersonParams);

    // Insert any additional people
    if (people && people.length > 0) {
      const peopleSql = `
        INSERT INTO people (
          applicationId, firstName, lastName, dateOfBirth, relationship
        ) VALUES (?, ?, ?, ?, ?)
      `;

      for (const person of people) {
        const peopleParams = [
          applicationId,
          person.firstName,
          person.lastName,
          person.dateOfBirth,
          person.relationship || null,
        ];
        await connection.execute(peopleSql, peopleParams);
      }
    }

    const vehicleSql = `
      INSERT INTO vehicles (
        applicationId, vin, year, makeModel
      ) VALUES (?, ?, ?, ?)
    `;

    for (const vehicle of vehicles) {
      // Check if the vehicle already exists based on VIN
      const checkVehicleSql = `SELECT id FROM vehicles WHERE vin = ?`;
      const [existingVehicle] = await connection.execute(checkVehicleSql, [
        vehicle.vin,
      ]);

      if ((existingVehicle as any[]).length === 0) {
        // Only insert if the vehicle does not already exist
        const vehicleParams = [
          applicationId,
          vehicle.vin,
          vehicle.year,
          vehicle.makeModel,
        ];
        await connection.execute(vehicleSql, vehicleParams);
      }
    }

    await connection.commit();

    res.status(201).json({
      message: `Thank you for your application. Your auto insurance quote is $${getRandomNumber(
        600,
        2000
      )} per every six months.`,
    });
  } catch (error) {
    await connection.rollback(); // Roll back the transaction in case of an error
    console.error(`Error saving insurance application: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
