import InsuranceApplicationValidator from "../validators/InsuranceApplicationValidator";
import InsuranceApplication from "../interfaces/InsuranceApplication";
import Person from "../interfaces/Person";
import Vehicle from "../interfaces/Vehicle";
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
      vehicles: [
        {
          vin: "1HGCM82633A123456",
          year: 2020,
          makeModel: "Honda Accord",
        },
      ],
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

  it("should return an error if vehicles array is empty", () => {
    application.vehicles = [];
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("At least one vehicle is required.");
  });

  it("should return an error if there are more than 3 vehicles", () => {
    application.vehicles = [
      { vin: "1HGCM82633A123456", year: 2020, makeModel: "Honda Accord" },
      { vin: "1HGCM82633A654321", year: 2019, makeModel: "Toyota Camry" },
      { vin: "1HGCM82633A987654", year: 2018, makeModel: "Ford Mustang" },
      { vin: "1HGCM82633A111111", year: 2017, makeModel: "Chevrolet Tahoe" },
    ];
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("A policy cannot have more than 3 vehicles.");
  });

  it("should return an error if a vehicle VIN is empty", () => {
    application.vehicles[0].vin = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(
      `Vehicle 1: ${ValidationUtils.getNonEmptyStringErrorMsg("VIN")}`
    );
  });

  it("should return an error if a vehicle year is out of range", () => {
    application.vehicles[0].year = 1980;
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain("Vehicle 1: Year must be between 1985 and 2025."); // Adjust the max year as needed
  });

  it("should return an error if a vehicle makeModel is empty", () => {
    application.vehicles[0].makeModel = "";
    const validator = new InsuranceApplicationValidator(application);
    const errors = validator.validateCompleteApplication();
    expect(errors).toContain(
      `Vehicle 1: ${ValidationUtils.getNonEmptyStringErrorMsg(
        "Make and model"
      )}`
    );
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
