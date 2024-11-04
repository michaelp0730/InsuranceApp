import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import pool from "../pool";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const partialApplication = req.body as Partial<InsuranceApplication>;
  const validator = new InsuranceApplicationValidator(partialApplication);
  const validationErrors = validator.validatePartialApplication();

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const fields: string[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];

    if (partialApplication.firstName) {
      fields.push("firstName");
      values.push(partialApplication.firstName);
      placeholders.push("?");
    }
    if (partialApplication.lastName) {
      fields.push("lastName");
      values.push(partialApplication.lastName);
      placeholders.push("?");
    }
    if (partialApplication.dateOfBirth) {
      fields.push("dateOfBirth");
      values.push(partialApplication.dateOfBirth);
      placeholders.push("?");
    }
    if (partialApplication.addressStreet) {
      fields.push("addressStreet");
      values.push(partialApplication.addressStreet);
      placeholders.push("?");
    }
    if (partialApplication.addressCity) {
      fields.push("addressCity");
      values.push(partialApplication.addressCity);
      placeholders.push("?");
    }
    if (partialApplication.addressState) {
      fields.push("addressState");
      values.push(partialApplication.addressState);
      placeholders.push("?");
    }
    if (partialApplication.addressZipCode) {
      fields.push("addressZipCode");
      values.push(partialApplication.addressZipCode);
      placeholders.push("?");
    }
    if (partialApplication.vehicleAVin) {
      fields.push("vehicleAVin");
      values.push(partialApplication.vehicleAVin);
      placeholders.push("?");
    }
    if (partialApplication.vehicleAYear) {
      fields.push("vehicleAYear");
      values.push(partialApplication.vehicleAYear);
      placeholders.push("?");
    }
    if (partialApplication.vehicleAMakeModel) {
      fields.push("vehicleAMakeModel");
      values.push(partialApplication.vehicleAMakeModel);
      placeholders.push("?");
    }

    if (fields.length === 0) {
      res
        .status(400)
        .json({ error: "No valid fields provided for initialization." });
      return;
    }

    const sql = `
      INSERT INTO applications (${fields.join(", ")})
      VALUES (${placeholders.join(", ")})
    `;

    const [result] = await pool.execute(sql, values);
    const applicationId = (result as any).insertId;

    res
      .status(201)
      .json({ message: "Application initialized successfully", applicationId });
  } catch (error) {
    console.error(`Error initializing insurance application: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
