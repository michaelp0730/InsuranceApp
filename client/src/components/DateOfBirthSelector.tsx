interface DateOfBirthSelectorProps {
  dateOfBirth: { month: string; date: string; year: string };
  setDateOfBirth: (dateOfBirth: {
    month: string;
    date: string;
    year: string;
  }) => void;
}

const DateOfBirthSelector: React.FC<DateOfBirthSelectorProps> = ({
  dateOfBirth,
  setDateOfBirth,
}) => {
  const { month, date, year } = dateOfBirth;

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateOfBirth({ ...dateOfBirth, month: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateOfBirth({ ...dateOfBirth, date: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateOfBirth({ ...dateOfBirth, year: e.target.value });
  };

  return (
    <div className="row">
      <div className="col-lg-4 mt-3 mt-lg-0">
        <select name="birth-month" value={month} onChange={handleMonthChange}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div className="col-lg-4 mt-3 mt-lg-0">
        <select name="birth-date" value={date} onChange={handleDateChange}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div className="col-lg-4 mt-3 mt-lg-0">
        <select name="birth-year" value={year} onChange={handleYearChange}>
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
