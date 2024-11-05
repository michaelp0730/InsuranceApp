import InsuranceApplication from "../interfaces/InsuranceApplication";
import VehicleValidator from "./VehicleValidator";
import PersonValidator from "./PersonValidator";
import {
  convertDateToPersonFormat,
  isAtLeast16YearsOld,
} from "../utils/ValidatorUtils";

class InsuranceApplicationSaveValidator {
  private application: InsuranceApplication;
  private errors: string[];

  constructor(application: InsuranceApplication) {
    this.application = application;
    this.errors = [];
  }

  validate(): string[] {
    this.errors = [];

    // Validate primary applicant fields only if provided
    if (
      this.application.firstName &&
      this.application.firstName.trim() === ""
    ) {
      this.errors.push("Primary Applicant first name must not be empty.");
    }

    if (this.application.lastName && this.application.lastName.trim() === "") {
      this.errors.push("Primary Applicant last name must not be empty.");
    }

    if (this.application.dateOfBirth) {
      const formattedDate = convertDateToPersonFormat(
        this.application.dateOfBirth
      );
      if (!isAtLeast16YearsOld(formattedDate)) {
        this.errors.push("Primary applicant must be at least 16 years old.");
      }
    }

    if (
      this.application.addressStreet &&
      this.application.addressStreet.trim() === ""
    ) {
      this.errors.push("Primary Applicant street address must not be empty.");
    }

    if (
      this.application.addressCity &&
      this.application.addressCity.trim() === ""
    ) {
      this.errors.push("Primary Applicant city must not be empty.");
    }

    if (
      this.application.addressState &&
      this.application.addressState.trim() === ""
    ) {
      this.errors.push("Primary Applicant state must not be empty.");
    }

    if (
      this.application.addressZipCode &&
      isNaN(this.application.addressZipCode)
    ) {
      this.errors.push("Primary Applicant zip code must be a valid number.");
    }

    // Validate vehicles only if provided
    if (this.application.vehicles) {
      this.application.vehicles.forEach((vehicle, index) => {
        const vehicleValidator = new VehicleValidator(vehicle);
        const vehicleErrors = vehicleValidator.validate();
        if (vehicleErrors.length > 0) {
          vehicleErrors.forEach((error) => {
            this.errors.push(`Vehicle ${index + 1}: ${error}`);
          });
        }
      });
    }

    // Validate additional applicants only if provided using PersonValidator
    if (this.application.people) {
      this.application.people.forEach((applicant, index) => {
        const additionalApplicantValidator = new PersonValidator(
          applicant,
          index
        );
        const applicantErrors = additionalApplicantValidator.validate();
        if (applicantErrors.length > 0) {
          this.errors.push(...applicantErrors);
        }
      });
    }

    return this.errors;
  }
}

export default InsuranceApplicationSaveValidator;
