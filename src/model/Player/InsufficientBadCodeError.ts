export default class InsufficientBadCodeError extends Error {
  constructor() {
    super("Not enough bad code");
  }
}
