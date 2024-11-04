export default class ValidationUtils {
  static getNonEmptyStringErrorMsg(fieldName: string): string {
    return `${fieldName} must be a non-empty string.`;
  }

  static getMinAgeErrorMsg(): string {
    return "Applicant must be at least 16 years of age.";
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
