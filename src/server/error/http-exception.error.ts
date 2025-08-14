export class HttpException extends Error {
  public readonly status: number;
  public readonly error?: Record<string, unknown>;

  constructor(
    status: number,
    message: string,
    error?: Record<string, unknown>,
  ) {
    super(message);
    this.status = status;
    this.error = error;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
