import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import VehicleValidator from "../validators/VehicleValidator"; // Import VehicleValidator
import pool from "../pool";

const router = express.Router();

router.put(
  "/:applicationId",
  async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const partialApplication = req.body as Partial<InsuranceApplication>;
    const validator = new InsuranceApplicationValidator(partialApplication);
    const validationErrors = validator.validatePartialApplication();

    // Validate vehicles if provided
    if (partialApplication.vehicles && partialApplication.vehicles.length > 0) {
      if (partialApplication.vehicles.length > 3) {
        validationErrors.push("A policy cannot have more than 3 vehicles.");
      } else {
        partialApplication.vehicles.forEach((vehicle, index) => {
          const vehicleValidator = new VehicleValidator(vehicle);
          const vehicleErrors = vehicleValidator.validate();
          vehicleErrors.forEach((error) => {
            validationErrors.push(`Vehicle ${index + 1}: ${error}`);
          });
        });
      }
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

      // Handle vehicle updates
      if (partialApplication.vehicles) {
        // Delete existing vehicles associated with the applicationId
        const deleteVehiclesSql = `DELETE FROM vehicles WHERE applicationId = ?`;
        await connection.execute(deleteVehiclesSql, [applicationId]);

        // Insert new vehicles
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

      // Return the applicationId
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
