import DateValidator from "./DateValidator";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import Person from "../interfaces/Person";
import PersonValidator from "./PersonValidator";
import ValidationUtils from "../utils/ValidationUtils";

class InsuranceApplicationValidator {
  private application: Partial<InsuranceApplication>;
  private errors: string[];
  private maxVehicleYear: number;
  private minVehicleYear: number;

  constructor(application: Partial<InsuranceApplication>) {
    const currentYear = new Date().getFullYear();
    this.application = application;
    this.errors = [];
    this.maxVehicleYear = currentYear + 1;
    this.minVehicleYear = 1985;
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
    if (!this.application.firstName) this.errors.push("firstName is required.");
    if (!this.application.lastName) this.errors.push("lastName is required.");
    if (!this.application.dateOfBirth) {
      this.errors.push("dateOfBirth is required.");
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

    this.validateVehicles();
    if (this.application.people) this.validatePeople(this.application.people);

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
    // Validate vehicleA only if any of its fields are provided
    if (
      this.application.vehicleAVin !== undefined ||
      this.application.vehicleAYear !== undefined ||
      this.application.vehicleAMakeModel !== undefined
    ) {
      if (!this.application.vehicleAVin?.trim()) {
        this.errors.push(
          ValidationUtils.getNonEmptyStringErrorMsg("vehicleAVin")
        );
      }
      if (
        this.application.vehicleAYear !== undefined &&
        (this.application.vehicleAYear < this.minVehicleYear ||
          this.application.vehicleAYear > new Date().getFullYear() + 1)
      ) {
        this.errors.push(
          `vehicleAYear must be between ${this.minVehicleYear} and the current year + 1.`
        );
      }
      if (!this.application.vehicleAMakeModel?.trim()) {
        this.errors.push(
          ValidationUtils.getNonEmptyStringErrorMsg("vehicleAMakeModel")
        );
      }
    }
    return this.errors;
  }

  private validateVehicles(): void {
    // Validate vehicleA (required)
    if (
      !this.application.vehicleAVin ||
      !this.application.vehicleAYear ||
      !this.application.vehicleAMakeModel
    ) {
      this.errors.push("vehicleA (VIN, year, and MakeModel) is required.");
    } else if (
      this.application.vehicleAYear < this.minVehicleYear ||
      this.application.vehicleAYear > this.maxVehicleYear
    ) {
      this.errors.push(this.getVehicleYearsErrorMsg("vehicleA"));
    }

    // Validate vehicleB (optional but must be complete if included)
    if (
      this.application.vehicleBVin ||
      this.application.vehicleBYear ||
      this.application.vehicleBMakeModel
    ) {
      if (
        !this.application.vehicleBVin ||
        !this.application.vehicleBYear ||
        !this.application.vehicleBMakeModel
      ) {
        this.errors.push(this.getVehicleRequiredFieldsErrorMsg("vehicleB"));
      } else if (
        this.application.vehicleBYear < this.minVehicleYear ||
        this.application.vehicleBYear > this.maxVehicleYear
      ) {
        this.errors.push(this.getVehicleYearsErrorMsg("vehicleB"));
      }
    }

    // Validate vehicleC (optional but must be complete if included)
    if (
      this.application.vehicleCVin ||
      this.application.vehicleCYear ||
      this.application.vehicleCMakeModel
    ) {
      if (
        !this.application.vehicleCVin ||
        !this.application.vehicleCYear ||
        !this.application.vehicleCMakeModel
      ) {
        this.errors.push(this.getVehicleRequiredFieldsErrorMsg("vehicleC"));
      } else if (
        this.application.vehicleCYear < this.minVehicleYear ||
        this.application.vehicleCYear > this.maxVehicleYear
      ) {
        this.errors.push(this.getVehicleYearsErrorMsg("vehicleC"));
      }
    }
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

  private getVehicleRequiredFieldsErrorMsg(vehicleName: string): string {
    return `${vehicleName} must have VIN, year, and MakeModel if included.`;
  }

  private getVehicleYearsErrorMsg(vehicleName: string): string {
    return `${vehicleName} year must be between ${this.minVehicleYear} and ${this.maxVehicleYear}.`;
  }
}

export default InsuranceApplicationValidator;
