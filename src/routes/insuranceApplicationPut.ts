import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import pool from "../pool";

const router = express.Router();

router.put(
  "/:applicationId",
  async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const partialApplication = req.body as Partial<InsuranceApplication>;
    const validator = new InsuranceApplicationValidator(partialApplication);
    const validationErrors = validator.validatePartialApplication();

    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const connection = await pool.getConnection();

    try {
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
      if (partialApplication.vehicleAVin) {
        fieldsToUpdate.push("vehicleAVin = ?");
        values.push(partialApplication.vehicleAVin);
      }
      if (partialApplication.vehicleAYear) {
        fieldsToUpdate.push("vehicleAYear = ?");
        values.push(partialApplication.vehicleAYear);
      }
      if (partialApplication.vehicleAMakeModel) {
        fieldsToUpdate.push("vehicleAMakeModel = ?");
        values.push(partialApplication.vehicleAMakeModel);
      }

      if (fieldsToUpdate.length === 0) {
        res.status(400).json({ error: "No valid fields to update." });
        return;
      }

      const updateSql = `
      UPDATE applications
      SET ${fieldsToUpdate.join(", ")}
      WHERE applicationId = ?
    `;
      values.push(applicationId);

      await connection.execute(updateSql, values);

      res.status(200).json({ message: "Application updated successfully." });
    } catch (error) {
      console.error(`Error updating insurance application: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  }
);

export default router;
