export default class BadCodeCountError extends Error {
  constructor() {
    super("Code count must > 0");
  }
}
