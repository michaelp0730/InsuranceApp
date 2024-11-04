import ValidationUtils from "../utils/ValidationUtils";
import VehicleValidator from "../validators/VehicleValidator";
import Vehicle from "../interfaces/Vehicle";

describe("VehicleValidator", () => {
  it("should return no errors for a valid vehicle", () => {
    const validVehicle: Vehicle = {
      vin: "1HGCM82633A123456",
      year: 2020,
      makeModel: "Honda Accord",
    };

    const validator = new VehicleValidator(validVehicle);
    const errors = validator.validate();

    expect(errors.length).toBe(0);
  });

  it("should return an error if VIN is an empty string", () => {
    const invalidVehicle: Vehicle = {
      vin: "",
      year: 2020,
      makeModel: "Honda Accord",
    };

    const validator = new VehicleValidator(invalidVehicle);
    const errors = validator.validate();

    expect(errors).toContain(ValidationUtils.getNonEmptyStringErrorMsg("VIN"));
  });

  it("should return an error if year is less than 1985", () => {
    const invalidVehicle: Vehicle = {
      vin: "1HGCM82633A123456",
      year: 1980, // Invalid year
      makeModel: "Honda Accord",
    };

    const validator = new VehicleValidator(invalidVehicle);
    const errors = validator.validate();

    expect(errors).toContain("Year must be between 1985 and 2025.");
  });

  it("should return an error if year is greater than the current year + 1", () => {
    const currentYear = new Date().getFullYear();
    const invalidVehicle: Vehicle = {
      vin: "1HGCM82633A123456",
      year: currentYear + 2,
      makeModel: "Honda Accord",
    };

    const validator = new VehicleValidator(invalidVehicle);
    const errors = validator.validate();

    expect(errors).toContain(
      `Year must be between 1985 and ${currentYear + 1}.`
    );
  });

  it("should return an error if makeModel is an empty string", () => {
    const invalidVehicle: Vehicle = {
      vin: "1HGCM82633A123456",
      year: 2020,
      makeModel: "",
    };

    const validator = new VehicleValidator(invalidVehicle);
    const errors = validator.validate();

    expect(errors).toContain(
      ValidationUtils.getNonEmptyStringErrorMsg("Make and model")
    );
  });
});
