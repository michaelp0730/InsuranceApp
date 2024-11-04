import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import Person from "../interfaces/Person";
import ValidationUtils from "../utils/ValidationUtils";

describe("InsuranceApplicationValidator", () => {
  let application: InsuranceApplication;

  beforeEach(() => {
    application = {
      applicationId: "88c68625-31cb-4a30-b7c4-04ce02c52001",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("2000-01-01"),
      addressStreet: "123 Main St",
      addressCity: "Anytown",
      addressState: "CA",
      addressZipCode: 12345,
      vehicleAVin: "1HGCM82633A123456",
      vehicleAYear: 2020,
      vehicleAMakeModel: "Honda Accord",
      people: [],
    };
  });

  it("should return no errors for a valid application", () => {
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toEqual([]);
  });

  it("should return an error if firstName is missing", () => {
    application.firstName = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("firstName is required.");
  });

  it("should return an error if lastName is missing", () => {
    application.lastName = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("lastName is required.");
  });

  it("should return an error if dateOfBirth is missing", () => {
    application.dateOfBirth = null as any; // Cast to `any` to simulate missing date
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("dateOfBirth is required.");
  });

  it("should return an error if the applicant is under 16 years old", () => {
    application.dateOfBirth = new Date();
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(ValidationUtils.getMinAgeErrorMsg());
  });

  it("should return an error if addressState is empty", () => {
    application.addressState = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("addressState")
    );
  });

  it("should return an error if addressZipCode contains letters", () => {
    application.addressZipCode = NaN as any;
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("addressZipCode must contain only numbers.");
  });

  it("should return an error if vehicleA details are missing", () => {
    application.vehicleAVin = "";
    application.vehicleAYear = null as any;
    application.vehicleAMakeModel = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(
      "vehicleA (VIN, year, and MakeModel) is required."
    );
  });

  it("should return an error if vehicleA year is out of range", () => {
    application.vehicleAYear = 1980;
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("vehicleA year must be between 1985 and 2025.");
  });

  it("should return an error if vehicleB details are incomplete", () => {
    application.vehicleBVin = "1HGCM82633A654321";
    application.vehicleBYear = null as any;
    application.vehicleBMakeModel = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(
      "vehicleB must have VIN, year, and MakeModel if included."
    );
  });

  it("should return an error if vehicleB year is out of range", () => {
    application.vehicleBVin = "1HGCM82633A654321";
    application.vehicleBYear = 2030;
    application.vehicleBMakeModel = "Toyota Camry";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("vehicleB year must be between 1985 and 2025.");
  });

  it("should validate multiple people correctly", () => {
    const person: Person = {
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: new Date("2010-01-01"),
      relationship: "Mother",
    };
    application.people = [person];
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(
      `Person 1: ${ValidationUtils.getMinAgeErrorMsg()}`
    );
  });
});
