import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import VehicleValidator from "../validators/VehicleValidator";
import PersonValidator from "../validators/PersonValidator";
import pool from "../pool";

const router = express.Router();

router.put(
  "/:applicationId",
  async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const partialApplication = req.body as Partial<InsuranceApplication>;

    if (partialApplication.dateOfBirth) {
      const date = new Date(partialApplication.dateOfBirth);
      date.setUTCHours(12, 0, 0, 0);
      partialApplication.dateOfBirth = date;
    }

    const validator = new InsuranceApplicationValidator(partialApplication);
    const validationErrors = validator.validatePartialApplication();

    // Validate vehicles if provided
    if (partialApplication.vehicles && partialApplication.vehicles.length > 0) {
      partialApplication.vehicles.forEach((vehicle, index) => {
        const vehicleValidator = new VehicleValidator(vehicle);
        const vehicleErrors = vehicleValidator.validate();
        vehicleErrors.forEach((error) => {
          validationErrors.push(`Vehicle ${index + 1}: ${error}`);
        });
      });
    }

    if (partialApplication.people && partialApplication.people.length > 0) {
      partialApplication.people = partialApplication.people.map(
        (person, index) => {
          if (person.dateOfBirth) {
            const parsedDateOfBirth = new Date(person.dateOfBirth);
            parsedDateOfBirth.setUTCHours(12, 0, 0, 0);
            person.dateOfBirth = parsedDateOfBirth;
          }

          const personValidator = new PersonValidator(person);
          const personErrors = personValidator.validate();

          personErrors.forEach((error) => {
            validationErrors.push(`Person ${index + 1}: ${error}`);
          });

          return person;
        }
      );
    }

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fieldsToUpdate: string[] = [];
      const values: any[] = [];

      if (partialApplication.firstName) {
        fieldsToUpdate.push("firstName = ?");
        values.push(partialApplication.firstName);
      }

      if (partialApplication.lastName) {
        fieldsToUpdate.push("lastName = ?");
        values.push(partialApplication.lastName);
      }

      if (partialApplication.dateOfBirth) {
        fieldsToUpdate.push("dateOfBirth = ?");
        values.push(partialApplication.dateOfBirth);
      }

      if (partialApplication.addressStreet) {
        fieldsToUpdate.push("addressStreet = ?");
        values.push(partialApplication.addressStreet);
      }

      if (partialApplication.addressCity) {
        fieldsToUpdate.push("addressCity = ?");
        values.push(partialApplication.addressCity);
      }

      if (partialApplication.addressState) {
        fieldsToUpdate.push("addressState = ?");
        values.push(partialApplication.addressState);
      }

      if (partialApplication.addressZipCode) {
        fieldsToUpdate.push("addressZipCode = ?");
        values.push(partialApplication.addressZipCode);
      }

      if (fieldsToUpdate.length > 0) {
        const updateSql = `
          UPDATE applications
          SET ${fieldsToUpdate.join(", ")}
          WHERE applicationId = ?
        `;
        values.push(applicationId);
        await connection.execute(updateSql, values);
      }

      const updatePrimaryPersonSql = `
        INSERT INTO people (applicationId, firstName, lastName, dateOfBirth, relationship)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE firstName = ?, lastName = ?, dateOfBirth = ?
      `;
      await connection.execute(updatePrimaryPersonSql, [
        applicationId,
        partialApplication.firstName,
        partialApplication.lastName,
        partialApplication.dateOfBirth,
        "Primary Applicant",
        partialApplication.firstName,
        partialApplication.lastName,
        partialApplication.dateOfBirth,
      ]);

      // Delete existing additional people records to replace with the updated data
      const deleteAdditionalPeopleSql = `DELETE FROM people WHERE applicationId = ? AND relationship != 'Primary Applicant'`;
      await connection.execute(deleteAdditionalPeopleSql, [applicationId]);

      // Re-insert all additional people records
      if (partialApplication.people && partialApplication.people.length > 0) {
        const insertPersonSql = `
          INSERT INTO people (applicationId, firstName, lastName, dateOfBirth, relationship)
          VALUES (?, ?, ?, ?, ?)
        `;
        for (const person of partialApplication.people) {
          await connection.execute(insertPersonSql, [
            applicationId,
            person.firstName,
            person.lastName,
            person.dateOfBirth,
            person.relationship || null,
          ]);
        }
      }

      // Delete existing vehicles and re-insert if provided
      const deleteVehiclesSql = `DELETE FROM vehicles WHERE applicationId = ?`;
      await connection.execute(deleteVehiclesSql, [applicationId]);

      if (
        partialApplication.vehicles &&
        partialApplication.vehicles.length > 0
      ) {
        const insertVehicleSql = `
          INSERT INTO vehicles (applicationId, vin, year, makeModel)
          VALUES (?, ?, ?, ?)
        `;
        for (const vehicle of partialApplication.vehicles) {
          await connection.execute(insertVehicleSql, [
            applicationId,
            vehicle.vin,
            vehicle.year,
            vehicle.makeModel,
          ]);
        }
      }

      await connection.commit();

      res.status(200).json({ applicationId });
    } catch (error) {
      await connection.rollback(); // Roll back the transaction in case of an error
      console.error(`Error updating insurance application: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  }
);

export default router;
