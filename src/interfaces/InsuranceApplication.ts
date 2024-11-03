import Person from "./Person";

interface InsuranceApplication {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipCode: number;
  vehicleAVin: string;
  vehicleAYear: number;
  vehicleAMakeModel: string;
  vehicleBVin?: string;
  vehicleBYear?: number;
  vehicleBMakeModel?: string;
  vehicleCVin?: string;
  vehicleCYear?: number;
  vehicleCMakeModel?: string;
  people?: Person[];
}

export default InsuranceApplication;
