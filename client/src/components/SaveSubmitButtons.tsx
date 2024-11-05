import React from "react";

interface SaveSubmitButtonsProps {
  onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SaveSubmitButtons: React.FC<SaveSubmitButtonsProps> = ({ onSave }) => {
  return (
    <fieldset className="mt-5">
      <button type="submit" className="btn btn-success">
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
