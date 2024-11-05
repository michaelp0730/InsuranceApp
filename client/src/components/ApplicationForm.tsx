import { useState } from "react";
import {
  generateApplicationId,
  validateApplicationId,
} from "../utils/ApplicationUtils";
import PrimaryApplicant from "./PrimaryApplicant";
import Vehicle from "../interfaces/Vehicle";
import Vehicles from "./Vehicles";
import VehicleValidator from "../validators/VehicleValidator";
import Person from "../interfaces/Person";
import PersonValidator from "../validators/PersonValidator";
import AdditionalApplicants from "./AdditionalApplicants";
import SaveSubmitButtons from "./SaveSubmitButtons";
import InsuranceApplicationSubmissionValidator from "../validators/InsuranceApplicationSubmissionValidator";

const ApplicationForm = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

    // Convert dateOfBirth to a Date object
    const { month, date, year } = primaryApplicant.dateOfBirth;
    const formattedDateOfBirth = new Date(`${year}-${month}-${date}`);

    // Flatten primaryApplicant properties into the applicationData object
    const applicationData = {
      applicationId,
      firstName: primaryApplicant.firstName,
      lastName: primaryApplicant.lastName,
      dateOfBirth: formattedDateOfBirth, // Use the converted Date object
      addressStreet: primaryApplicant.addressStreet,
      addressCity: primaryApplicant.addressCity,
      addressState: primaryApplicant.addressState,
      addressZipCode: Number(primaryApplicant.addressZipCode), // Ensure Zip Code is a number
      vehicles,
      additionalApplicants,
    };

    // Instantiate and use InsuranceApplicationSubmissionValidator
    const validator = new InsuranceApplicationSubmissionValidator(
      applicationData
    );
    const validationErrors = validator.validate();
    console.log(validationErrors);

    // Map validation errors to the form fields
    const errorMap: { [key: string]: string } = {};

    validationErrors.forEach((error) => {
      if (error.includes("First name is required")) errorMap.firstName = error;
      if (error.includes("Last name is required")) errorMap.lastName = error;
      if (error.includes("16 years old")) errorMap.dateOfBirth = error;
      if (error.includes("street is required")) errorMap.addressStreet = error;
      if (error.includes("city is required")) errorMap.addressCity = error;
      if (error.includes("state is required")) errorMap.addressState = error;
      if (error.includes("zip code")) errorMap.addressZipCode = error;
      if (error.includes("At least one vehicle")) errorMap.vehicles = error;
    });

    setErrors(errorMap);

    // If there are any errors, prevent submission
    if (Object.keys(errorMap).length > 0) return;

    console.log("Submitting application:", applicationData);
  };

  return (
    <form className="card p-5" onSubmit={handleSubmit}>
      <PrimaryApplicant
        primaryApplicant={primaryApplicant}
        setPrimaryApplicant={setPrimaryApplicant}
        errors={errors}
      />
      <Vehicles vehicles={vehicles} setVehicles={setVehicles} errors={errors} />
      <AdditionalApplicants
        additionalApplicants={additionalApplicants}
        setAdditionalApplicants={setAdditionalApplicants}
        errors={errors}
      />
      <SaveSubmitButtons onSave={handleSave} />
    </form>
  );
};

export default ApplicationForm;
