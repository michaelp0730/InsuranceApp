export const isAtLeast16YearsOld = (dateOfBirth: {
  month: string;
  date: string;
  year: string;
}): boolean => {
  const dob = new Date(
    `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.date}`
  );
  if (isNaN(dob.getTime())) {
    return false;
  }

  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  return age > 16 || (age === 16 && hasHadBirthdayThisYear);
};

export const convertDateToPersonFormat = (
  date: Date
): {
  month: string;
  date: string;
  year: string;
} => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return {
    month: monthNames[date.getMonth()],
    date: date.getDate().toString(),
    year: date.getFullYear().toString(),
  };
};
