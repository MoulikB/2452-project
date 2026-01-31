export default class InvalidAmountError extends Error {
  constructor() {
    super("Amount must be non-negative");
    this.name = "InvalidAmountError";
  }
}
