export class MaxAttemptsReachedError extends Error {
  constructor() {
    super("Maximum number of submission attempts reached.");
    this.name = "MaxAttemptsReachedError";
  }
}

export class LateSubmissionNotAllowedError extends Error {
  constructor() {
    super("The instructor didn't allow for late submissions");
    this.name = "LateSubmissionNotAllowedError";
  }
}
