const AdditionalApplicants = ({
  additionalApplicants,
  setAdditionalApplicants,
}) => {
  return (
    <fieldset className="mt-5">
      <h2 className="display-6">Additional Applicants</h2>
      <button type="button" className="btn btn-outline-primary">
        Add Applicant
      </button>
    </fieldset>
  );
};

export default AdditionalApplicants;
