export class InvalidUpgradeCountError extends Error {
  constructor(message: string = "Invalid Error Count") {
    super(message);
    this.name = "InvalidUpgradeCountError";
  }
}
