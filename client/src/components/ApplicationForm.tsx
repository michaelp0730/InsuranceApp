import { useEffect, useState } from "react";
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
import handleSave from "../utils/SaveHandler";
import handleSubmit from "../utils/SubmitHandler";

const ApplicationForm = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isNewApplicationSubmitted, setIsNewApplicationSubmitted] =
    useState(false);
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
  const currentPort = window.location.port;
  const queryStringParams = new URLSearchParams(window.location.search);
  const applicationIdParam = queryStringParams.get("applicationId");

  const isExistingApplication: boolean =
    !!applicationIdParam && validateApplicationId(applicationIdParam);

  const applicationId =
    isExistingApplication && !!applicationIdParam
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

  const clearAlerts = () => {
    setAlertMessage("");
    setAlertType("");
  };

  useEffect(() => {
    if (isExistingApplication && !isNewApplicationSubmitted) {
      const fetchTimeout = setTimeout(() => {
        fetch(`http://localhost:5150/api/get-application/${applicationId}`)
          .then((response) => {
            if (!response.ok) {
              setAlertType("alert-danger");
              setAlertMessage(
                `Your application could not be found. Please try again, or start a new application at ` +
                  `http://localhost:${currentPort}`
              );
            }
            return response.json();
          })
          .then((data) => {
            // Parse the dateOfBirth and check if it's a valid date
            const parsedDate = new Date(data.dateOfBirth);
            const isValidDate = !isNaN(parsedDate.getTime());

            setPrimaryApplicant({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              dateOfBirth: isValidDate
                ? {
                    // Use numerical format for month: "01", "02", etc.
                    month: ("0" + (parsedDate.getMonth() + 1)).slice(-2),
                    date: parsedDate.getDate().toString(),
                    year: parsedDate.getFullYear().toString(),
                  }
                : { month: "01", date: "1", year: "2024" }, // Default values if the date is invalid
              addressStreet: data.addressStreet || "",
              addressCity: data.addressCity || "",
              addressState: data.addressState || "",
              addressZipCode: data.addressZipCode?.toString() || "",
            });

            setVehicles(
              data.vehicles?.map((vehicle: Vehicle) => ({
                vin: vehicle.vin || "",
                year: vehicle.year || "",
                makeModel: vehicle.makeModel || "",
              })) || []
            );

            setAdditionalApplicants(
              data.people
                ?.filter(
                  (person: Person) =>
                    person.relationship !== "Primary Applicant"
                )
                .map((person: any) => {
                  const personDate = new Date(person.dateOfBirth);
                  const personIsValidDate = !isNaN(personDate.getTime());
                  return {
                    firstName: person.firstName || "",
                    lastName: person.lastName || "",
                    dateOfBirth: personIsValidDate
                      ? {
                          month: ("0" + (personDate.getMonth() + 1)).slice(-2),
                          date: personDate.getDate().toString(),
                          year: personDate.getFullYear().toString(),
                        }
                      : { month: "01", date: "1", year: "2024" }, // Default values if the date is invalid
                    relationship: person.relationship || "",
                  };
                }) || []
            );
          })
          .catch((error) => {
            console.error("Error fetching application:", error);
            setAlertType("alert-danger");
            setAlertMessage(
              `Failed to load application data. Please try again, or begin a new application at http://localhost:${currentPort}`
            );
          });
      }, 1000);

      return () => clearTimeout(fetchTimeout);
    }
  }, [
    isExistingApplication,
    isNewApplicationSubmitted,
    applicationId,
    currentPort,
  ]);

  const handleSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(
      e,
      {
        applicationId,
        firstName: primaryApplicant.firstName,
        lastName: primaryApplicant.lastName,
        dateOfBirth: new Date(
          `${primaryApplicant.dateOfBirth.year}-${primaryApplicant.dateOfBirth.month}-${primaryApplicant.dateOfBirth.date}`
        ),
        addressStreet: primaryApplicant.addressStreet,
        addressCity: primaryApplicant.addressCity,
        addressState: primaryApplicant.addressState,
        addressZipCode: Number(primaryApplicant.addressZipCode),
        vehicles,
        people: additionalApplicants,
      },
      currentUrl,
      setErrors,
      setAlertMessage,
      setAlertType,
      clearAlerts
    );

    setIsNewApplicationSubmitted(true);
  };

  const handleSaveWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSave(
      e,
      {
        applicationId,
        firstName: primaryApplicant.firstName,
        lastName: primaryApplicant.lastName,
        dateOfBirth: new Date(
          `${primaryApplicant.dateOfBirth.year}-${primaryApplicant.dateOfBirth.month}-${primaryApplicant.dateOfBirth.date}`
        ),
        addressStreet: primaryApplicant.addressStreet,
        addressCity: primaryApplicant.addressCity,
        addressState: primaryApplicant.addressState,
        addressZipCode: Number(primaryApplicant.addressZipCode),
        vehicles,
        people: additionalApplicants,
      },
      isExistingApplication,
      applicationId,
      currentUrl,
      currentPort,
      setErrors,
      setAlertMessage,
      setAlertType,
      clearAlerts
    );

    setIsNewApplicationSubmitted(true);
  };

  return (
    <>
      {alertMessage && (
        <div className={`alert ${alertType}`} role="alert">
          {alertMessage}
        </div>
      )}
      <form className="card p-5" onSubmit={handleSubmitWrapper}>
        <PrimaryApplicant
          primaryApplicant={primaryApplicant}
          setPrimaryApplicant={setPrimaryApplicant}
          errors={errors.genericErrors}
          clearAlerts={clearAlerts}
        />
        <Vehicles
          vehicles={vehicles}
          setVehicles={setVehicles}
          errors={errors.vehicleErrors}
          genericError={errors.genericErrors.vehicles}
          clearAlerts={clearAlerts}
        />
        <AdditionalApplicants
          additionalApplicants={additionalApplicants}
          setAdditionalApplicants={setAdditionalApplicants}
          errors={errors.applicantErrors}
          setErrors={setErrors}
          clearAlerts={clearAlerts}
        />
        <SaveSubmitButtons onSave={handleSaveWrapper} />
      </form>
    </>
  );
};

export default ApplicationForm;
