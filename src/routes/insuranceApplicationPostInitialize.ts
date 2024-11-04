import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import VehicleValidator from "../validators/VehicleValidator"; // Import VehicleValidator
import pool from "../pool";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
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

    // Insert vehicles if provided
    if (partialApplication.vehicles && partialApplication.vehicles.length > 0) {
      const vehicleSql = `
        INSERT INTO vehicles (applicationId, vin, year, makeModel)
        VALUES (?, ?, ?, ?)
      `;

      for (const vehicle of partialApplication.vehicles) {
        await pool.execute(vehicleSql, [
          applicationId,
          vehicle.vin,
          vehicle.year,
          vehicle.makeModel,
        ]);
      }
    }

    // Return the applicationId for the front-end to construct a link allowing the user to resume the application
    res.status(201).json({ applicationId });
  } catch (error) {
    console.error(`Error initializing insurance application: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
