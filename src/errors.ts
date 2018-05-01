export class TimeoutError extends Error {
  constructor(...args) {
    super(...args);
    this.name = TimeoutError.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }
}
