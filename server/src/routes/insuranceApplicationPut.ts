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

    // Create a validator instance and collect errors
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

    // Validate people if provided and cast dateOfBirth from string to Date
    if (partialApplication.people && partialApplication.people.length > 0) {
      partialApplication.people = partialApplication.people.map(
        (person, index) => {
          // Parse the dateOfBirth to a Date object
          const parsedDateOfBirth = new Date(person.dateOfBirth);
          person.dateOfBirth = parsedDateOfBirth;

          // Perform validation
          const personValidator = new PersonValidator(person);
          const personErrors = personValidator.validate();

          personErrors.forEach((error) => {
            validationErrors.push(`Person ${index + 1}: ${error}`);
          });

          return person;
        }
      );
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Update the application fields if provided
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

      // Check existing vehicle count for the application
      const checkVehicleCountSql = `SELECT COUNT(*) as vehicleCount FROM vehicles WHERE applicationId = ?`;
      const [vehicleCountResult] = await connection.execute(
        checkVehicleCountSql,
        [applicationId]
      );
      const vehicleCount = (vehicleCountResult as any)[0].vehicleCount;

      // Validate that adding new vehicles will not exceed 3
      const totalVehicleCount =
        vehicleCount +
        (partialApplication.vehicles ? partialApplication.vehicles.length : 0);
      if (totalVehicleCount > 3) {
        res
          .status(400)
          .json({ error: "A policy cannot have more than 3 vehicles." });
        await connection.rollback();
        return;
      }

      // Insert new vehicles if provided
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

      // Insert new people if provided
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
