import Person from "./Person";
import Vehicle from "./Vehicle";

interface InsuranceApplication {
  applicationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipCode: number;
  vehicles: Vehicle[];
  people?: Person[];
}

export default InsuranceApplication;
