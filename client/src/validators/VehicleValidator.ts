import Vehicle from "../interfaces/Vehicle";

class VehicleValidator {
  private vehicle: Vehicle;
  private errors: string[];

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.errors = [];
  }

  validate(): string[] {
    this.errors = [];

    if (!this.vehicle.vin || this.vehicle.vin.trim().length !== 17) {
      this.errors.push("VIN must be exactly 17 characters.");
    }

    if (!this.vehicle.makeModel || this.vehicle.makeModel.trim() === "") {
      this.errors.push("Make and model are required.");
    }

    const currentYear = new Date().getFullYear();
    const minYear = 1985;
    const maxYear = currentYear + 1;

    if (!this.vehicle.year || isNaN(this.vehicle.year)) {
      this.errors.push("Year must be a valid number.");
    } else if (this.vehicle.year < minYear || this.vehicle.year > maxYear) {
      this.errors.push(`Year must be between ${minYear} and ${maxYear}.`);
    }

    return this.errors;
  }
}

export default VehicleValidator;
