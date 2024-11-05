import { useState } from "react";
import {
  addQueryStringToUrl,
  formatDateForDatabase,
  generateApplicationId,
  validateApplicationId,
  updateUrl,
} from "../utils/ApplicationUtils";
import PrimaryApplicant from "./PrimaryApplicant";
import Vehicle from "../interfaces/Vehicle";
import Vehicles from "./Vehicles";
import Person from "../interfaces/Person";
import AdditionalApplicants from "./AdditionalApplicants";
import SaveSubmitButtons from "./SaveSubmitButtons";
import InsuranceApplicationSubmissionValidator from "../validators/InsuranceApplicationSubmissionValidator";
import InsuranceApplicationSaveValidator from "../validators/InsuranceApplicationSaveValidator";

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

  const currentUrl = window.location.href;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const vehicleErrors: string[][] = Array.from(
      { length: vehicles.length },
      () => []
    );

    const applicantErrors: { [key: string]: string }[] = Array(
      additionalApplicants.length
    ).fill({});

    // Map validation errors to the correct fields
    validationErrors.forEach((error) => {
      if (error.includes("Primary Applicant first name is required"))
        genericErrors.firstName = error;
      if (error.includes("Primary Applicant last name is required"))
        genericErrors.lastName = error;
      if (
        error.includes("Primary applicant must be at least 16 years old") ||
        error.includes("Primary Applicant date of birth is required")
      )
        genericErrors.dateOfBirth = error;
      if (error.includes("Primary Applicant street address is required"))
        genericErrors.addressStreet = error;
      if (error.includes("Primary Applicant city is required"))
        genericErrors.addressCity = error;
      if (error.includes("Primary Applicant state is required"))
        genericErrors.addressState = error;
      if (error.includes("Primary Applicant zip code must be a valid number"))
        genericErrors.addressZipCode = error;
      if (error.includes("At least one vehicle"))
        genericErrors.vehicles = error;

      // Handle vehicle-specific errors
      const vehicleMatch = error.match(/Vehicle (\d+): (.+)/);
      if (vehicleMatch) {
        const vehicleIndex = parseInt(vehicleMatch[1], 10) - 1;
        const vehicleError = vehicleMatch[2];
        if (!vehicleErrors[vehicleIndex]) {
          vehicleErrors[vehicleIndex] = [];
        }
        vehicleErrors[vehicleIndex].push(vehicleError);
      }

      // Handle additional applicant-specific errors
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
        } else if (
          applicantError.includes("Date of birth") ||
          applicantError.includes("at least 16 years old")
        ) {
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

    const dateOfBirthString = formatDateForDatabase(
      applicationData.dateOfBirth
    );

    const updatedApplicationData = {
      ...applicationData,
      dateOfBirth: dateOfBirthString,
    };

    const queryParams = {
      applicationId,
    };
    const updatedUrl = addQueryStringToUrl(currentUrl, queryParams);
    updateUrl(updatedUrl);

    try {
      const response = await fetch(
        "http://localhost:5150/api/post-complete-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedApplicationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save the application");
      }

      console.log("Application saved successfully:", applicationData);
      console.log(`Submission response: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
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

    const saveValidator = new InsuranceApplicationSaveValidator(
      applicationData
    );
    const validationErrors = saveValidator.validate();
    const genericErrors: { [key: string]: string } = {};
    const vehicleErrors: string[][] = Array.from(
      { length: vehicles.length },
      () => []
    );
    const applicantErrors: { [key: string]: string }[] = Array(
      additionalApplicants.length
    ).fill({});

    // Map validation errors to the correct fields
    validationErrors.forEach((error) => {
      if (error.includes("Primary Applicant first name is required"))
        genericErrors.firstName = error;
      if (error.includes("Primary Applicant last name is required"))
        genericErrors.lastName = error;
      if (
        error.includes("Primary applicant must be at least 16 years old") ||
        error.includes("Primary Applicant date of birth is required")
      )
        genericErrors.dateOfBirth = error;
      if (error.includes("Primary Applicant street address is required"))
        genericErrors.addressStreet = error;
      if (error.includes("Primary Applicant city is required"))
        genericErrors.addressCity = error;
      if (error.includes("Primary Applicant state is required"))
        genericErrors.addressState = error;
      if (error.includes("Primary Applicant zip code must be a valid number"))
        genericErrors.addressZipCode = error;
      if (error.includes("At least one vehicle"))
        genericErrors.vehicles = error;

      // Handle vehicle-specific errors
      const vehicleMatch = error.match(/Vehicle (\d+): (.+)/);
      if (vehicleMatch) {
        const vehicleIndex = parseInt(vehicleMatch[1], 10) - 1;
        const vehicleError = vehicleMatch[2];
        if (!vehicleErrors[vehicleIndex]) {
          vehicleErrors[vehicleIndex] = [];
        }
        vehicleErrors[vehicleIndex].push(vehicleError);
      }

      // Handle additional applicant-specific errors
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
        } else if (
          applicantError.includes("Date of birth") ||
          applicantError.includes("at least 16 years old")
        ) {
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

    const dateOfBirthString = formatDateForDatabase(
      applicationData.dateOfBirth
    );

    const updatedApplicationData = {
      ...applicationData,
      dateOfBirth: dateOfBirthString,
    };

    const queryParams = {
      applicationId,
    };
    const updatedUrl = addQueryStringToUrl(currentUrl, queryParams);
    updateUrl(updatedUrl);

    console.log("Saving application:", updatedApplicationData);
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
