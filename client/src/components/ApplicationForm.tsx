import { useState } from "react";
import {
  generateApplicationId,
  validateApplicationId,
} from "../utils/ApplicationUtils";
import PrimaryApplicant from "./PrimaryApplicant";
import Vehicle from "../interfaces/Vehicle";
import Vehicles from "./Vehicles";
import Person from "../interfaces/Person";
import AdditionalApplicants from "./AdditionalApplicants";
import SaveSubmitButtons from "./SaveSubmitButtons";
import InsuranceApplicationSubmissionValidator from "../validators/InsuranceApplicationSubmissionValidator";

const ApplicationForm = () => {
  const [errors, setErrors] = useState<{
    genericErrors: { [key: string]: string };
    vehicleErrors: string[][];
    applicantErrors: { [key: string]: string }[];
  }>({
    genericErrors: {},
    vehicleErrors: [],
    applicantErrors: [],
  });

  const queryStringParams = new URLSearchParams(window.location.search);
  const applicationIdParam = queryStringParams.get("applicationId");
  const isExistingApplication =
    applicationIdParam && validateApplicationId(applicationIdParam);
  const applicationId = isExistingApplication
    ? applicationIdParam
    : generateApplicationId();

  const [primaryApplicant, setPrimaryApplicant] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: { month: "January", date: "1", year: "2024" },
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZipCode: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [additionalApplicants, setAdditionalApplicants] = useState<Person[]>(
    []
  );

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const applicationData = {
      applicationId,
      primaryApplicant,
      vehicles,
      additionalApplicants,
    };

    console.log("Saving application:", applicationData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { month, date, year } = primaryApplicant.dateOfBirth;
    const formattedDateOfBirth = new Date(`${year}-${month}-${date}`);
    const applicationData = {
      applicationId,
      firstName: primaryApplicant.firstName,
      lastName: primaryApplicant.lastName,
      dateOfBirth: formattedDateOfBirth,
      addressStreet: primaryApplicant.addressStreet,
      addressCity: primaryApplicant.addressCity,
      addressState: primaryApplicant.addressState,
      addressZipCode: Number(primaryApplicant.addressZipCode),
      vehicles,
      people: additionalApplicants,
    };

    const validator = new InsuranceApplicationSubmissionValidator(
      applicationData
    );
    const validationErrors = validator.validate();

    const genericErrors: { [key: string]: string } = {};
    const vehicleErrors: string[][] = Array(vehicles.length).fill([]);
    const applicantErrors: { [key: string]: string }[] = Array(
      additionalApplicants.length
    ).fill({});

    validationErrors.forEach((error) => {
      // Generic errors for primary applicant and address
      if (error.includes("Primary Applicant first name is required."))
        genericErrors.firstName = error;
      if (error.includes("Primary Applicant last name is required"))
        genericErrors.lastName = error;
      if (
        error.includes("Primary applicant must be at least 16 years old.") ||
        error.includes("Primary Applicant date of birth is required.")
      )
        genericErrors.dateOfBirth = error;
      if (error.includes("Primary Applicant street address is required."))
        genericErrors.addressStreet = error;
      if (error.includes("Primary Applicant city is required."))
        genericErrors.addressCity = error;
      if (error.includes("Primary Applicant state is required."))
        genericErrors.addressState = error;
      if (error.includes("Primary Applicant zip code must be a valid number."))
        genericErrors.addressZipCode = error;
      if (error.includes("At least one vehicle"))
        genericErrors.vehicles = error;

      // Vehicle errors
      const vehicleMatch = error.match(/Vehicle (\d+): (.+)/);
      if (vehicleMatch) {
        const vehicleIndex = parseInt(vehicleMatch[1], 10) - 1;
        const vehicleError = vehicleMatch[2];
        if (!vehicleErrors[vehicleIndex]) {
          vehicleErrors[vehicleIndex] = [];
        }
        vehicleErrors[vehicleIndex].push(vehicleError);
      }

      // Additional applicant errors
      const applicantMatch = error.match(/Applicant (\d+): (.+)/);
      if (applicantMatch) {
        const applicantIndex = parseInt(applicantMatch[1], 10) - 1;
        const applicantError = applicantMatch[2];

        if (!applicantErrors[applicantIndex]) {
          applicantErrors[applicantIndex] = {};
        }

        if (applicantError.includes("First name")) {
          applicantErrors[applicantIndex].firstName = applicantError;
        } else if (applicantError.includes("Last name")) {
          applicantErrors[applicantIndex].lastName = applicantError;
        } else if (applicantError.includes("Date of birth")) {
          applicantErrors[applicantIndex].dateOfBirth = applicantError;
        } else if (applicantError.includes("Relationship")) {
          applicantErrors[applicantIndex].relationship = applicantError;
        }
      }
    });

    setErrors({
      genericErrors,
      vehicleErrors,
      applicantErrors,
    });

    const hasErrors =
      Object.keys(genericErrors).length > 0 ||
      vehicleErrors.some((v) => v.length > 0) ||
      applicantErrors.some((a) => Object.keys(a).length > 0);

    if (hasErrors) return;

    console.log("Submitting application:", applicationData);
  };

  return (
    <form className="card p-5" onSubmit={handleSubmit}>
      <PrimaryApplicant
        primaryApplicant={primaryApplicant}
        setPrimaryApplicant={setPrimaryApplicant}
        errors={errors.genericErrors}
      />
      <Vehicles
        vehicles={vehicles}
        setVehicles={setVehicles}
        errors={errors.vehicleErrors}
        genericError={errors.genericErrors.vehicles}
      />
      <AdditionalApplicants
        additionalApplicants={additionalApplicants}
        setAdditionalApplicants={setAdditionalApplicants}
        errors={errors.applicantErrors}
        setErrors={setErrors}
      />
      <SaveSubmitButtons onSave={handleSave} />
    </form>
  );
};

export default ApplicationForm;
