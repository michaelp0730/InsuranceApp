import { useState } from "react";
import {
  generateApplicationId,
  validateApplicationId,
} from "../utils/ApplicationUtils";
import PrimaryApplicant from "./PrimaryApplicant";
import Vehicle from "../interfaces/Vehicle";
import Vehicles from "./Vehicles";
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
    dateOfBirth: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZipCode: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [additionalApplicants, setAdditionalApplicants] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();

    const applicationData = {
      applicationId,
      primaryApplicant,
      vehicles,
      additionalApplicants,
    };

    console.log("Saving application:", applicationData);
  };

  const handleSubmit = (e: Event) => {
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
    <form className="card p-5" onSubmit={(e) => handleSubmit(e)}>
      <PrimaryApplicant
        primaryApplicant={primaryApplicant}
        setPrimaryApplicant={setPrimaryApplicant}
      />
      <Vehicles vehicles={vehicles} setVehicles={setVehicles} />
      <AdditionalApplicants
        additionalApplicants={additionalApplicants}
        setAdditionalApplicants={setAdditionalApplicants}
      />
      <SaveSubmitButtons onSave={handleSave} onSubmit={handleSubmit} />
    </form>
  );
};

export default ApplicationForm;
