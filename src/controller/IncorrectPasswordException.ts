export default class IncorrectPasswordException extends Error {
  constructor() {
    super("Incorrect Password!");
  }
}
