export class GeneralHelpers {
  public static isNullOrEmpty(value: string): boolean {
    return value === undefined || value === null || value === '';
  }
}
