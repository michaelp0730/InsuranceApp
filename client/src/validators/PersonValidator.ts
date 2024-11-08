import Person from "../interfaces/Person";

class PersonValidator {
  private person: Person;
  private errors: string[];
  private prefix: string;

  constructor(person: Person, index?: number) {
    this.person = person;
    this.errors = [];
    this.prefix = index !== undefined ? `Applicant ${index + 1}: ` : "";
  }

  validate(): string[] {
    this.errors = [];

    if (!this.person.firstName || this.person.firstName.trim() === "") {
      this.errors.push(`${this.prefix}First name is required.`);
    }

    if (!this.person.lastName || this.person.lastName.trim() === "") {
      this.errors.push(`${this.prefix}Last name is required.`);
    }

    if (!this.person.dateOfBirth) {
      this.errors.push(`${this.prefix}Date of birth is required.`);
    } else {
      const formattedDate = this.formatDateOfBirth(this.person.dateOfBirth);
      if (!this.isAtLeast16YearsOld(formattedDate)) {
        this.errors.push(`${this.prefix}Person must be at least 16 years old.`);
      }
    }

    if (!this.person.relationship || this.person.relationship.trim() === "") {
      this.errors.push(`${this.prefix}Relationship is required.`);
    }

    return this.errors;
  }

  private formatDateOfBirth(dateOfBirth: {
    month: string;
    date: string;
    year: string;
  }): string {
    const { month, date, year } = dateOfBirth;
    const monthIndex = new Date(`${month} 1`).getMonth() + 1;
    const formattedMonth = monthIndex.toString().padStart(2, "0");
    const formattedDate = date.padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDate}`;
  }

  private isAtLeast16YearsOld(dateOfBirth: string): boolean {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return false;
    }

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    return age > 16 || (age === 16 && hasHadBirthdayThisYear);
  }
}

export default PersonValidator;
