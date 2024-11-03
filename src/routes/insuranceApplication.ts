import express, { Request, Response } from "express";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const insuranceApplication = req.body as InsuranceApplication;
  const validator = new InsuranceApplicationValidator(insuranceApplication);
  const validationErrors = validator.validate();

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  // Placeholder for database logic
  try {
    console.log(`Application: ${JSON.stringify(insuranceApplication)}`);
    res
      .status(201)
      .json({ message: "Insurance application submitted successfully" });
  } catch (error) {
    console.error(`Error saving insurance application: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
