import React from "react";

interface StateSelectorProps {
  state: string;
  setState: (state: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ state, setState }) => {
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  return (
    <>
      <label htmlFor="address-state-select">State</label>
      <br />
      <select
        name="address-state-select"
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        <option value="">Select a state</option>
        {states.map((stateName) => (
          <option key={stateName} value={stateName}>
            {stateName}
          </option>
        ))}
      </select>
    </>
  );
};

export default StateSelector;
