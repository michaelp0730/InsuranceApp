import React from "react";
import DateOfBirthSelector from "./DateOfBirthSelector";
import StateSelector from "./StateSelector";

interface PrimaryApplicantProps {
  primaryApplicant: {
    firstName: string;
    lastName: string;
    addressStreet: string;
    addressCity: string;
    addressZipCode: string;
    addressState: string;
    dateOfBirth: { month: string; date: string; year: string };
  };
  setPrimaryApplicant: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      addressStreet: string;
      addressCity: string;
      addressZipCode: string;
      addressState: string;
      dateOfBirth: { month: string; date: string; year: string };
    }>
  >;
  errors: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    addressStreet?: string;
    addressCity?: string;
    addressZipCode?: string;
    addressState?: string;
  };
}

const PrimaryApplicant: React.FC<PrimaryApplicantProps> = ({
  primaryApplicant,
  setPrimaryApplicant,
  errors,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrimaryApplicant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setDateOfBirth = (dateOfBirth: {
    month: string;
    date: string;
    year: string;
  }) => {
    setPrimaryApplicant((prev) => ({
      ...prev,
      dateOfBirth,
    }));
  };

  const setState = (state: string) => {
    setPrimaryApplicant((prev) => ({
      ...prev,
      addressState: state,
    }));
  };

  return (
    <fieldset>
      <h2 className="display-6">Primary Applicant</h2>
      <div className="row">
        <div className="col-lg-4 mt-3">
          <label htmlFor="firstName">First Name</label>
          <br />
          <input
            type="text"
            name="firstName"
            value={primaryApplicant.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p>
              <small className="text-danger">{errors.firstName}</small>
            </p>
          )}
        </div>
        <div className="col-lg-4 mt-3">
          <label htmlFor="lastName">Last Name</label>
          <br />
          <input
            type="text"
            name="lastName"
            value={primaryApplicant.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p>
              <small className="text-danger">{errors.lastName}</small>
            </p>
          )}
        </div>
        <div className="col-lg-4 mt-3">
          <label htmlFor="birth-date-select">Date of Birth</label>
          <br />
          <DateOfBirthSelector
            dateOfBirth={primaryApplicant.dateOfBirth}
            setDateOfBirth={setDateOfBirth}
          />
          {errors.dateOfBirth && (
            <p>
              <small className="text-danger">{errors.dateOfBirth}</small>
            </p>
          )}
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-4 mt-3">
          <label htmlFor="address-street-input">Street Address</label>
          <br />
          <input
            type="text"
            name="addressStreet"
            value={primaryApplicant.addressStreet}
            onChange={handleChange}
          />
          {errors.addressStreet && (
            <p>
              <small className="text-danger">{errors.addressStreet}</small>
            </p>
          )}
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-lg-4 mt-3">
              <label htmlFor="address-city-input">City</label>
              <br />
              <input
                type="text"
                name="addressCity"
                value={primaryApplicant.addressCity}
                onChange={handleChange}
              />
              {errors.addressCity && (
                <p>
                  <small className="text-danger">{errors.addressCity}</small>
                </p>
              )}
            </div>
            <div className="col-lg-4 mt-3">
              <StateSelector
                state={primaryApplicant.addressState}
                setState={setState}
              />
              {errors.addressState && (
                <p>
                  <small className="text-danger">{errors.addressState}</small>
                </p>
              )}
            </div>
            <div className="col-lg-4 mt-3">
              <label htmlFor="addressZipCode">Zip Code</label>
              <br />
              <input
                type="text"
                name="addressZipCode"
                value={primaryApplicant.addressZipCode}
                onChange={handleChange}
              />
              {errors.addressZipCode && (
                <p>
                  <small className="text-danger">{errors.addressZipCode}</small>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default PrimaryApplicant;
