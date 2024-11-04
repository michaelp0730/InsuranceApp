import DateValidator from "./DateValidator";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import Person from "../interfaces/Person";
import PersonValidator from "./PersonValidator";
import VehicleValidator from "./VehicleValidator";
import ValidationUtils from "../utils/ValidationUtils";

class InsuranceApplicationValidator {
  private application: Partial<InsuranceApplication>;
  private errors: string[];

  constructor(application: Partial<InsuranceApplication>) {
    this.application = application;
    this.errors = [];
  }

  validateCompleteApplication(): string[] {
    // Validate applicationId
    if (
      !this.application.applicationId ||
      !ValidationUtils.isValidUUID(this.application.applicationId)
    ) {
      this.errors.push("applicationId must be a valid UUID.");
    }

    // Validate applicant fields
    if (!this.application.firstName)
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("firstName"));

    if (!this.application.lastName)
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("lastName"));

    if (!this.application.dateOfBirth) {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("dateOfBirth")
      );
    } else if (
      !DateValidator.isAtLeast16YearsOld(this.application.dateOfBirth)
    ) {
      this.errors.push(ValidationUtils.getMinAgeErrorMsg());
    }

    // Validate address fields
    if (
      !this.application.addressStreet ||
      this.application.addressStreet.trim() === ""
    ) {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("addressStreet")
      );
    }

    if (
      !this.application.addressCity ||
      this.application.addressCity.trim() === ""
    ) {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("addressCity")
      );
    }

    if (
      !this.application.addressState ||
      this.application.addressState.trim() === ""
    ) {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("addressState")
      );
    }

    if (!/^\d+$/.test(this.application?.addressZipCode?.toString() ?? "")) {
      this.errors.push("addressZipCode must contain only numbers.");
    }

    // Validate vehicles
    this.validateVehicles();

    // Validate people
    if (this.application.people) {
      this.validatePeople(this.application.people);
    }

    return this.errors;
  }

  validatePartialApplication(): string[] {
    if (
      this.application.firstName !== undefined &&
      !this.application.firstName.trim()
    ) {
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("firstName"));
    }
    if (
      this.application.lastName !== undefined &&
      !this.application.lastName.trim()
    ) {
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("lastName"));
    }
    if (this.application.dateOfBirth !== undefined) {
      if (
        !(this.application.dateOfBirth instanceof Date) ||
        isNaN(this.application.dateOfBirth.getTime())
      ) {
        this.errors.push("dateOfBirth must be a valid date.");
      }
    }
    if (
      this.application.addressState !== undefined &&
      !this.application.addressState.trim()
    ) {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("addressState")
      );
    }
    if (
      this.application.addressZipCode !== undefined &&
      (!Number.isInteger(this.application.addressZipCode) ||
        this.application.addressZipCode <= 0)
    ) {
      this.errors.push("addressZipCode must be a positive integer.");
    }
    return this.errors;
  }

  private validateVehicles(): void {
    const { vehicles } = this.application;

    if (!vehicles || vehicles.length === 0) {
      this.errors.push("At least one vehicle is required.");
      return;
    }

    if (vehicles.length > 3) {
      this.errors.push("A policy cannot have more than 3 vehicles.");
      return;
    }

    vehicles.forEach((vehicle, index) => {
      const vehicleValidator = new VehicleValidator(vehicle);
      const vehicleErrors = vehicleValidator.validate();
      vehicleErrors.forEach((error) => {
        this.errors.push(`Vehicle ${index + 1}: ${error}`);
      });
    });
  }

  private validatePeople(people: Person[]): void {
    people.forEach((person, index) => {
      const personValidator = new PersonValidator(person);
      const personErrors = personValidator.validate();

      personErrors.forEach((error) => {
        this.errors.push(`Person ${index + 1}: ${error}`);
      });
    });
  }
}

export default InsuranceApplicationValidator;
