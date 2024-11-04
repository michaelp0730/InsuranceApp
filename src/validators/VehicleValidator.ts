import ValidationUtils from "../utils/ValidationUtils";
import Vehicle from "../interfaces/Vehicle";

class VehicleValidator {
  private vehicle: Partial<Vehicle>;
  private errors: string[];
  private minVehicleYear: number;
  private maxVehicleYear: number;

  constructor(vehicle: Partial<Vehicle>) {
    const currentYear = new Date().getFullYear();
    this.vehicle = vehicle;
    this.errors = [];
    this.minVehicleYear = 1985;
    this.maxVehicleYear = currentYear + 1; // Allow vehicles up to next year
  }

  validate(): string[] {
    if (!this.vehicle.vin || this.vehicle.vin.trim() === "") {
      this.errors.push(ValidationUtils.getNonEmptyStringErrorMsg("VIN"));
    }

    if (
      this.vehicle.year === undefined ||
      this.vehicle.year < this.minVehicleYear ||
      this.vehicle.year > this.maxVehicleYear
    ) {
      this.errors.push(
        `Year must be between ${this.minVehicleYear} and ${this.maxVehicleYear}.`
      );
    }

    if (!this.vehicle.makeModel || this.vehicle.makeModel.trim() === "") {
      this.errors.push(
        ValidationUtils.getNonEmptyStringErrorMsg("Make and model")
      );
    }

    return this.errors;
  }
}

export default VehicleValidator;
