import React from "react";
import Person from "../interfaces/Person";
import DateOfBirthSelector from "./DateOfBirthSelector";

interface AdditionalApplicantsProps {
  additionalApplicants: Person[];
  setAdditionalApplicants: React.Dispatch<React.SetStateAction<Person[]>>;
  clearAlerts: () => void;
  errors: { [key: string]: string }[];
  setErrors: React.Dispatch<
    React.SetStateAction<{
      genericErrors: { [key: string]: string };
      vehicleErrors: string[][];
      applicantErrors: { [key: string]: string }[];
    }>
  >;
}

const AdditionalApplicants: React.FC<AdditionalApplicantsProps> = ({
  additionalApplicants,
  setAdditionalApplicants,
  clearAlerts,
  errors,
  setErrors,
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

    // Clear errors for the new applicant
    setErrors((prevErrors) => {
      const newErrors = Array.isArray(prevErrors.applicantErrors)
        ? [...prevErrors.applicantErrors, {}] // Add a new empty object for the new applicant
        : [{}]; // Initialize with an empty object if it wasn't an array already

      return { ...prevErrors, applicantErrors: newErrors };
    });

    clearAlerts();
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
    clearAlerts();
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
    clearAlerts();
  };

  const deleteApplicant = (index: number) => {
    setAdditionalApplicants((prev) => prev.filter((_, i) => i !== index));

    // Clear errors for the deleted applicant
    setErrors((prevErrors) => {
      if (!Array.isArray(prevErrors.applicantErrors)) {
        return prevErrors;
      }
      const newErrors = prevErrors.applicantErrors.filter(
        (_, i) => i !== index
      );
      return { ...prevErrors, applicantErrors: newErrors };
    });
    clearAlerts();
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
            {errors[index]?.firstName && (
              <p>
                <small className="text-danger">{errors[index].firstName}</small>
              </p>
            )}
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
            {errors[index]?.lastName && (
              <p>
                <small className="text-danger">{errors[index].lastName}</small>
              </p>
            )}
          </div>
          <div className="col-lg-3">
            <label>Date of Birth:</label>
            <br />
            <DateOfBirthSelector
              dateOfBirth={applicant.dateOfBirth}
              setDateOfBirth={(date) => handleDateOfBirthChange(index, date)}
            />
          </div>
          {errors[index]?.dateOfBirth && (
            <p>
              <small className="text-danger">{errors[index].dateOfBirth}</small>
            </p>
          )}
          <div className="col-lg-3">
            <label>Relationship:</label>
            <br />
            <input
              type="text"
              name="relationship"
              value={applicant.relationship}
              onChange={(e) => handleApplicantChange(index, e)}
            />
            {errors[index]?.relationship && (
              <p>
                <small className="text-danger">
                  {errors[index].relationship}
                </small>
              </p>
            )}
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
