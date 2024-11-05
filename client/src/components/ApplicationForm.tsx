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

    const applicationData = {
      applicationId,
      primaryApplicant,
      vehicles,
      additionalApplicants,
    };

    console.log("Submitting application:", applicationData);
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
