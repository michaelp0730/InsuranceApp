import { useState } from "react";
import DateOfBirthSelector from "./DateOfBirthSelector";

const ApplicationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZipCode, setAddressZipCode] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);

  return (
    <form className="card p-5">
      <fieldset>
        <h2 className="display-6">Primary Applicant</h2>
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="firstName">First Name</label>
            <br />
            <input type="text" name="firstName" />
          </div>
          <div className="col-md-4">
            <label htmlFor="lastName">Last Name</label>
            <br />
            <input type="text" name="lastName" />
          </div>
          <div className="col-md-4">
            <label htmlFor="birthMonth">Date of Birth</label>
            <br />
            <DateOfBirthSelector />
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-4">
            <label htmlFor="addressStreet">Street Address</label>
            <br />
            <input type="text" name="addressStreet" />
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="addressCity">City</label>
                <br />
                <input type="text" name="addressCity" />
              </div>
              <div className="col-md-4">
                <label htmlFor="addressState">State</label>
                <br />
                <input type="text" name="addressCity" />
              </div>
              <div className="col-md-4">
                <label htmlFor="addressZipCode">Zip Code</label>
                <br />
                <input type="text" name="addressZipCode" />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="mt-5">
        <h2 className="display-6">Vehicles</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card p-3">
              <p>
                <input type="text" placeholder="VIN" />
              </p>
              <p>
                <input type="text" placeholder="Year" />
              </p>
              <p>
                <input type="text" placeholder="Make and Model" />
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <button type="button" className="btn btn-outline-primary">
                Add Vehicle
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <button type="button" className="btn btn-outline-primary">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="mt-5">
        <h2 className="display-6">Additional Applicants</h2>
        <button type="button" className="btn btn-outline-primary">
          Add Applicant
        </button>
      </fieldset>
      <fieldset className="mt-5">
        <button type="submit" className="btn btn-success">
          Submit
        </button>
        &nbsp;
        <button type="button" className="btn btn-primary">
          Save Changes
        </button>
      </fieldset>
    </form>
  );
};

export default ApplicationForm;
