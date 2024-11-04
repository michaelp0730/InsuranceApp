import PersonValidator from "../validators/PersonValidator";
import Person from "../interfaces/Person";
import ValidationUtils from "../utils/ValidationUtils";

describe("PersonValidator", () => {
  it("should return no errors for a valid person", () => {
    const person: Person = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("2000-01-01"),
      relationship: "Spouse",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();
    expect(errors).toHaveLength(0);
  });

  it("should return an error if firstName is an empty string", () => {
    const person: Person = {
      firstName: "",
      lastName: "Doe",
      dateOfBirth: new Date("2000-01-01"),
      relationship: "Spouse",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();
    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("firstName")
    );
  });

  it("should return an error if lastName is an empty string", () => {
    const person: Person = {
      firstName: "John",
      lastName: "",
      dateOfBirth: new Date("2000-01-01"),
      relationship: "Spouse",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();
    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("lastName")
    );
  });

  it("should return an error if relationship is an empty string", () => {
    const person: Person = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("2000-01-01"),
      relationship: "",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();
    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("relationship")
    );
  });

  it("should return an error if dateOfBirth is not a valid date", () => {
    const person: Person = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("invalid-date"),
      relationship: "Spouse",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();
    expect(errors).toContain("dateOfBirth must be a valid date.");
  });

  it("should return an error if the person is younger than 16 years old", () => {
    const person: Person = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date(), // Today's date, meaning age is 0
      relationship: "Spouse",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();
    expect(errors).toContain(ValidationUtils.getMinAgeErrorMsg());
  });

  it("should return multiple errors for an invalid person", () => {
    const person: Person = {
      firstName: "",
      lastName: "",
      dateOfBirth: new Date("invalid-date"),
      relationship: "",
    };
    const validator = new PersonValidator(person);
    const errors = validator.validate();

    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("firstName")
    );

    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("lastName")
    );

    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("relationship")
    );

    expect(errors).toContain("dateOfBirth must be a valid date.");
  });
});
