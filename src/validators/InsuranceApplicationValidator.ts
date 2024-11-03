import InsuranceApplication from "../interfaces/InsuranceApplication";
import Person from "../interfaces/Person";

class InsuranceApplicationValidator {
  private application: InsuranceApplication;
  private errors: string[];

  constructor(application: InsuranceApplication) {
    this.application = application;
    this.errors = [];
  }

  validate(): string[] {
    // Validate required fields
    if (!this.application.firstName) this.errors.push("firstName is required.");
    if (!this.application.lastName) this.errors.push("lastName is required.");
    if (!this.application.dateOfBirth) {
      this.errors.push("dateOfBirth is required.");
    } else if (!this.isAtLeast16YearsOld(this.application.dateOfBirth)) {
      this.errors.push("Applicant must be at least 16 years old.");
    }

    // Validate address fields
    if (
      !this.application.addressStreet ||
      this.application.addressStreet.trim() === ""
    ) {
      this.errors.push("addressStreet must be a non-empty string.");
    }

    if (
      !this.application.addressCity ||
      this.application.addressCity.trim() === ""
    ) {
      this.errors.push("addressCity must be a non-empty string.");
    }

    if (
      !this.application.addressState ||
      this.application.addressState.trim() === ""
    ) {
      this.errors.push("addressState must be a non-empty string.");
    }

    if (!/^\d+$/.test(this.application.addressZipCode.toString())) {
      this.errors.push("addressZipCode must contain only numbers.");
    }

    this.validateVehicles();
    if (this.application.people) this.validatePeople(this.application.people);

    return this.errors;
  }

  private isAtLeast16YearsOld(dateOfBirth: Date): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has occurred this year
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    // If the birthday has not occurred yet this year, subtract 1 from the age
    return hasHadBirthdayThisYear ? age >= 16 : age - 1 >= 16;
  }

  private validateVehicles(): void {
    const currentYear = new Date().getFullYear();
    const minYear = 1985;
    const maxYear = currentYear + 1;

    // Validate vehicleA (required)
    if (
      !this.application.vehicleAVin ||
      !this.application.vehicleAYear ||
      !this.application.vehicleAMakeModel
    ) {
      this.errors.push("VehicleA (VIN, year, and MakeModel) is required.");
    } else if (
      this.application.vehicleAYear < minYear ||
      this.application.vehicleAYear > maxYear
    ) {
      this.errors.push(
        this.getVehicleYearsErrorMsg("VehicleA", minYear, maxYear)
      );
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
        this.errors.push(this.getVehicleRequiredFieldsErrorMsg("VehicleB"));
      } else if (
        this.application.vehicleBYear < minYear ||
        this.application.vehicleBYear > maxYear
      ) {
        this.errors.push(
          this.getVehicleYearsErrorMsg("VehicleB", minYear, maxYear)
        );
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
        this.errors.push(this.getVehicleRequiredFieldsErrorMsg("VehicleC"));
      } else if (
        this.application.vehicleCYear < minYear ||
        this.application.vehicleCYear > maxYear
      ) {
        this.errors.push(
          this.getVehicleYearsErrorMsg("VehicleC", minYear, maxYear)
        );
      }
    }
  }

  private validatePeople(people: Person[]): void {
    people.forEach((person, index) => {
      if (!person.firstName) {
        this.errors.push(`Person ${index + 1}: firstName is required.`);
      }

      if (!person.lastName) {
        this.errors.push(`Person ${index + 1}: lastName is required.`);
      }

      if (!person.dateOfBirth) {
        this.errors.push(`Person ${index + 1}: dateOfBirth is required.`);
      } else if (!this.isAtLeast16YearsOld(person.dateOfBirth)) {
        this.errors.push(`Person ${index + 1}: must be at least 16 years old.`);
      }
    });
  }

  private getVehicleRequiredFieldsErrorMsg(vehicleName: string): string {
    return `${vehicleName} must have VIN, year, and MakeModel if included.`;
  }

  private getVehicleYearsErrorMsg(
    vehicleName: string,
    minYear: number,
    maxYear: number
  ): string {
    return `${vehicleName} year must be between ${minYear} and ${maxYear}.`;
  }
}

export default InsuranceApplicationValidator;
