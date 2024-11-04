const SaveSubmitButtons = ({ onSave, onSubmit }) => {
  return (
    <fieldset className="mt-5">
      <button type="submit" className="btn btn-success" onClick={onSubmit}>
        Submit
      </button>
      &nbsp;
      <button type="button" className="btn btn-primary" onClick={onSave}>
        Save Changes
      </button>
    </fieldset>
  );
};

export default SaveSubmitButtons;
