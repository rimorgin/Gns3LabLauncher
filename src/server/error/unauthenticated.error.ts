export class UnauthenticatedRequestError extends Error {
  constructor() {
    super("Unathenticated request occurred");
    this.name = "UnauthenticatedRequestError";
  }
}
