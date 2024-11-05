import { Dispatch, MouseEvent, SetStateAction } from "react";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import InsuranceApplicationSaveValidator from "../validators/InsuranceApplicationSaveValidator";
import {
  addQueryStringToUrl,
  formatDateForDatabase,
  updateUrl,
} from "../utils/ApplicationUtils";

const handleSave = async (
  e: MouseEvent<HTMLButtonElement>,
  applicationData: InsuranceApplication,
  isExistingApplication: boolean,
  applicationId: string,
  currentUrl: string,
  currentPort: string,
  setErrors: Dispatch<
    SetStateAction<{
      genericErrors: { [key: string]: string };
      vehicleErrors: string[][];
      applicantErrors: { [key: string]: string }[];
    }>
  >,
  setAlertMessage: Dispatch<SetStateAction<string>>,
  setAlertType: Dispatch<SetStateAction<string>>,
  clearAlerts: () => void
) => {
  e.preventDefault();
  clearAlerts();

  // Validate the application data
  const saveValidator = new InsuranceApplicationSaveValidator(applicationData);
  const validationErrors = saveValidator.validate();

  const genericErrors: { [key: string]: string } = {};
  const vehicleErrors: string[][] = Array.from(
    { length: applicationData.vehicles.length },
    () => []
  );
  const applicantErrors: { [key: string]: string }[] = Array(
    applicationData.people?.length
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
    if (error.includes("At least one vehicle")) genericErrors.vehicles = error;

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

  const dateOfBirthString = formatDateForDatabase(applicationData.dateOfBirth);

  // Format the additional applicants' date of birth as strings, ensuring valid dates
  const formattedPeople =
    applicationData.people?.map((person) => {
      const { month, date, year } = person.dateOfBirth;
      const dobString = `${year}-${month}-${date}`;
      const dob = new Date(dobString);

      return {
        ...person,
        dateOfBirth: !isNaN(dob.getTime()) ? formatDateForDatabase(dob) : null,
      };
    }) || [];

  const updatedApplicationData = {
    ...applicationData,
    dateOfBirth: dateOfBirthString,
    people: formattedPeople,
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
          body: JSON.stringify(updatedApplicationData),
        }
      );
    }

    if (!response || !response.ok) {
      console.error("Error response:", response);
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
    console.error("Error saving insurance application:", JSON.stringify(error));
    setAlertType("alert-danger");
    setAlertMessage(
      "There was an error saving your application. Please try again."
    );
  }

  const queryParams = { applicationId };
  const updatedUrl = addQueryStringToUrl(currentUrl, queryParams);
  updateUrl(updatedUrl);

  console.log("Saving application:", updatedApplicationData);
};

export default handleSave;
