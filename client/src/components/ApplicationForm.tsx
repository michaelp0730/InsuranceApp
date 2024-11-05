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
    const convertedDateOfBirth = convertToDate(primaryApplicant.dateOfBirth);

    const applicationData = {
      applicationId,
      firstName: primaryApplicant.firstName,
      lastName: primaryApplicant.lastName,
      dateOfBirth: convertedDateOfBirth,
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

    const errors = validator.validate();

    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      alert("Please fix the errors before submitting:\n" + errors.join("\n"));
      return;
    }

    console.log("Submitting application:", applicationData);
  };

  const convertToDate = (dateObj: {
    month: string;
    date: string;
    year: string;
  }): Date => {
    const { month, date, year } = dateObj;
    return new Date(`${year}-${month}-${date}`);
  };

  return (
    <form className="card p-5" onSubmit={handleSubmit}>
      <PrimaryApplicant
        primaryApplicant={primaryApplicant}
        setPrimaryApplicant={setPrimaryApplicant}
      />
      <Vehicles vehicles={vehicles} setVehicles={setVehicles} />
      <AdditionalApplicants
        additionalApplicants={additionalApplicants}
        setAdditionalApplicants={setAdditionalApplicants}
      />
      <SaveSubmitButtons onSave={handleSave} />
    </form>
  );
};

export default ApplicationForm;
