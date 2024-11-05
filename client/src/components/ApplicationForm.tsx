import { useEffect, useState } from "react";
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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
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

  const clearAlerts = () => {
    setAlertMessage("");
    setAlertType("");
  };

  useEffect(() => {
    // Only fetch data if it's an existing application
    if (isExistingApplication) {
      fetch(`http://localhost:5150/api/get-application/${applicationId}`)
        .then((response) => {
          if (!response.ok) {
            console.error(
              `Error getting application from database: ${JSON.stringify(
                response
              )}`
            );
          }
          return response.json();
        })
        .then((data) => {
          // Update the form state with the fetched data
          setPrimaryApplicant({
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: {
              month: new Date(data.dateOfBirth).toLocaleString("default", {
                month: "long",
              }),
              date: new Date(data.dateOfBirth).getDate().toString(),
              year: new Date(data.dateOfBirth).getFullYear().toString(),
            },
            addressStreet: data.addressStreet,
            addressCity: data.addressCity,
            addressState: data.addressState,
            addressZipCode: data.addressZipCode.toString(),
          });

          setVehicles(
            data.vehicles.map((vehicle: Vehicle) => ({
              vin: vehicle.vin,
              year: vehicle.year,
              makeModel: vehicle.makeModel,
            }))
          );

          setAdditionalApplicants(
            data.people
              .filter(
                (person: Person) => person.relationship !== "Primary Applicant"
              )
              .map((person: any) => ({
                firstName: person.firstName,
                lastName: person.lastName,
                dateOfBirth: {
                  month: new Date(person.dateOfBirth).toLocaleString(
                    "default",
                    {
                      month: "long",
                    }
                  ),
                  date: new Date(person.dateOfBirth).getDate().toString(),
                  year: new Date(person.dateOfBirth).getFullYear().toString(),
                },
                relationship: person.relationship,
              }))
          );
        })
        .catch((error) => {
          console.error("Error fetching application:", error);
          setAlertType("alert-danger");
          setAlertMessage(
            `Failed to load application data. Please try again, or begin at new application at http://localhost:${currentPort}`
          );
        });
    }
  }, [isExistingApplication, applicationId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAlerts();

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

      const responseData = await response.json();

      if (!response.ok) {
        setAlertMessage(responseData.message);
        setAlertType("alert-danger");
      } else {
        setAlertMessage(responseData.message);
        setAlertType("alert-success");
      }

      console.log("Application saved successfully:", applicationData);
    } catch (error) {
      console.error("Error saving application:", error);
      setAlertType("alert-danger");
      setAlertMessage(
        "There was an error saving your application. Please try again."
      );
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearAlerts();

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

    try {
      let response;

      if (!isExistingApplication) {
        // If it's a new application, post to the initialize route
        response = await fetch(
          "http://localhost:5150/api/post-initialize-application",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(applicationData),
          }
        );
      } else {
        response = {
          ok: true,
          message: "foobar",
        };
      }

      if (!response.ok) {
        setAlertType("alert-danger");
        setAlertMessage(
          "There was an error saving your application. Please try again."
        );
      } else {
        setAlertType("alert-success");
        setAlertMessage(
          `Thank you for saving your auto insurance application. ` +
            `Please revisit this application at http://localhost:${currentPort}/?applicationId=${applicationId}, ` +
            `or keep this page open, to complete your application.`
        );
      }
    } catch (error) {
      console.error("Error saving insurance application:", error);
    }

    const queryParams = {
      applicationId,
    };
    const updatedUrl = addQueryStringToUrl(currentUrl, queryParams);
    updateUrl(updatedUrl);

    console.log("Saving application:", updatedApplicationData);
  };

  return (
    <>
      {alertMessage && (
        <div className={`alert ${alertType}`} role="alert">
          {alertMessage}
        </div>
      )}
      <form className="card p-5" onSubmit={handleSubmit}>
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
        <SaveSubmitButtons onSave={handleSave} />
      </form>
    </>
  );
};

export default ApplicationForm;
