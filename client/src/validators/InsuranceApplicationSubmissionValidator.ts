import InsuranceApplication from "../interfaces/InsuranceApplication";
import VehicleValidator from "./VehicleValidator";
import PersonValidator from "./PersonValidator";

class InsuranceApplicationSubmissionValidator {
  private application: InsuranceApplication;
  private errors: string[];

  constructor(application: InsuranceApplication) {
    this.application = application;
    this.errors = [];
  }

  validate(): string[] {
    this.errors = [];

    const dateOfBirth = this.convertDateToPersonFormat(
      this.application.dateOfBirth
    );

    const primaryApplicantValidator = new PersonValidator({
      firstName: this.application.firstName,
      lastName: this.application.lastName,
      dateOfBirth: dateOfBirth,
      relationship: "Primary Applicant",
    });
    const primaryApplicantErrors = primaryApplicantValidator.validate();

    if (primaryApplicantErrors.length > 0) {
      this.errors.push(...primaryApplicantErrors);
    }

    if (
      !this.application.addressStreet ||
      this.application.addressStreet.trim() === ""
    ) {
      this.errors.push("Address street is required.");
    }

    if (
      !this.application.addressCity ||
      this.application.addressCity.trim() === ""
    ) {
      this.errors.push("Address city is required.");
    }

    if (
      !this.application.addressState ||
      this.application.addressState.trim() === ""
    ) {
      this.errors.push("Address state is required.");
    }

    if (
      !this.application.addressZipCode ||
      isNaN(this.application.addressZipCode)
    ) {
      this.errors.push("Address zip code must be a valid number.");
    }

    if (!this.application.vehicles || this.application.vehicles.length === 0) {
      this.errors.push("At least one vehicle is required.");
    } else {
      this.application.vehicles.forEach((vehicle, index) => {
        const vehicleValidator = new VehicleValidator(vehicle);
        const vehicleErrors = vehicleValidator.validate();
        vehicleErrors.forEach((error) => {
          this.errors.push(`Vehicle ${index + 1}: ${error}`);
        });
      });
    }

    return this.errors;
  }

  private convertDateToPersonFormat(date: Date): {
    month: string;
    date: string;
    year: string;
  } {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return {
      month: monthNames[date.getMonth()],
      date: date.getDate().toString(),
      year: date.getFullYear().toString(),
    };
  }
}

export default InsuranceApplicationSubmissionValidator;
