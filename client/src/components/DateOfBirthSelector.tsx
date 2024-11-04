const DateOfBirthSelector = () => {
  return (
    <div className="row">
      <div className="col-md-4">
        <select name="birthMonth">
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
      </div>
      <div className="col-md-4">
        <select>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
            <option key={num}>{num}</option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <select>
          {Array.from({ length: 2024 - 1930 + 1 }, (_, i) => 2024 - i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default DateOfBirthSelector;
