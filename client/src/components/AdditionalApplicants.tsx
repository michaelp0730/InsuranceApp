import React from "react";
import Person from "../interfaces/Person";
import DateOfBirthSelector from "./DateOfBirthSelector";

interface AdditionalApplicantsProps {
  additionalApplicants: Person[];
  setAdditionalApplicants: React.Dispatch<React.SetStateAction<Person[]>>;
}

const AdditionalApplicants: React.FC<AdditionalApplicantsProps> = ({
  additionalApplicants,
  setAdditionalApplicants,
}) => {
  const addApplicant = () => {
    setAdditionalApplicants((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        dateOfBirth: { month: "January", date: "1", year: "2024" },
        relationship: "",
      },
    ]);
  };

  const handleApplicantChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAdditionalApplicants((prev) =>
      prev.map((applicant, i) =>
        i === index ? { ...applicant, [name]: value } : applicant
      )
    );
  };

  const handleDateOfBirthChange = (
    index: number,
    dateOfBirth: { month: string; date: string; year: string }
  ) => {
    setAdditionalApplicants((prev) =>
      prev.map((applicant, i) =>
        i === index ? { ...applicant, dateOfBirth } : applicant
      )
    );
  };

  const deleteApplicant = (index: number) => {
    setAdditionalApplicants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <fieldset className="mt-5">
      <h2 className="display-6">Additional Applicants</h2>
      {additionalApplicants.map((applicant, index) => (
        <div key={`row-${index}`} className="row my-3">
          <div className="col-lg-3">
            <label>First Name:</label>
            <br />
            <input
              type="text"
              name="firstName"
              value={applicant.firstName}
              onChange={(e) => handleApplicantChange(index, e)}
            />
          </div>
          <div className="col-lg-3">
            <label>Last Name:</label>
            <br />
            <input
              type="text"
              name="lastName"
              value={applicant.lastName}
              onChange={(e) => handleApplicantChange(index, e)}
            />
          </div>
          <div className="col-lg-3">
            <label>Date of Birth:</label>
            <br />
            <DateOfBirthSelector
              dateOfBirth={applicant.dateOfBirth}
              setDateOfBirth={(date) => handleDateOfBirthChange(index, date)}
            />
          </div>
          <div className="col-lg-3">
            <label>Relationship:</label>
            <br />
            <input
              type="text"
              name="relationship"
              value={applicant.relationship}
              onChange={(e) => handleApplicantChange(index, e)}
            />
          </div>
          <p>
            <button
              type="button"
              className="btn btn-danger mt-2"
              onClick={() => deleteApplicant(index)}
            >
              Delete Applicant
            </button>
          </p>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-primary mt-3"
        onClick={addApplicant}
      >
        Add Applicant
      </button>
    </fieldset>
  );
};

export default AdditionalApplicants;
