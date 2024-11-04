export default class DateValidator {
  static isAtLeast16YearsOld(dateOfBirth: Date): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has occurred this year
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    // If the birthday has not occurred yet this year, subtract 1 from the age
    return hasHadBirthdayThisYear ? age >= 16 : age - 1 >= 16;
  }
}
