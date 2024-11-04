import DateValidator from "./DateValidator";
import Person from "../interfaces/Person";
import ValidationUtils from "../utils/ValidationUtils";

export default class PersonValidator {
  private person: Person;
  private errors: string[];

  constructor(person: Person) {
    this.person = person;
    this.errors = [];
  }

  validate(): string[] {
    if (!this.person.firstName || !this.person.firstName.trim()) {
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("firstName"));
    }

    if (!this.person.lastName || !this.person.lastName.trim()) {
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("lastName"));
    }

    if (!this.person.relationship || !this.person.relationship.trim()) {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("relationship")
      );
    }

    if (
      !(this.person.dateOfBirth instanceof Date) ||
      isNaN(this.person.dateOfBirth.getTime())
    ) {
      this.errors.push("dateOfBirth must be a valid date.");
    } else if (!DateValidator.isAtLeast16YearsOld(this.person.dateOfBirth)) {
      this.errors.push(ValidationUtils.getMinAgeErrorMsg());
    }

    return this.errors;
  }
}
