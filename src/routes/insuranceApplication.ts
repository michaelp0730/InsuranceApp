import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import pool from "../pool";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const insuranceApplication = req.body as InsuranceApplication;
  const validator = new InsuranceApplicationValidator(insuranceApplication);
  const validationErrors = validator.validate();

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    console.log(`Application: ${JSON.stringify(insuranceApplication)}`);
    const {
      firstName,
      lastName,
      dateOfBirth,
      addressStreet,
      addressCity,
      addressState,
      addressZipCode,
      vehicleAVin,
      vehicleAYear,
      vehicleAMakeModel,
    } = insuranceApplication;

    const sql = `
      INSERT INTO applications (
        firstName, lastName, dateOfBirth, addressStreet, addressCity, addressState, addressZipCode,
        vehicleAVin, vehicleAYear, vehicleAMakeModel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      firstName,
      lastName,
      dateOfBirth,
      addressStreet,
      addressCity,
      addressState,
      addressZipCode,
      vehicleAVin,
      vehicleAYear,
      vehicleAMakeModel,
    ];

    const [result] = await pool.execute(sql, params);
    console.log("Database Insertion Result:", result);

    res
      .status(201)
      .json({ message: "Insurance application submitted successfully" });
  } catch (error) {
    console.error(`Error saving insurance application: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
