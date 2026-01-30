export class InvalidClickPowerError extends Error {
  constructor(message: string = "Click power must be at least 1") {
    super(message);
    this.name = "InvalidClickPowerError";
  }
}
