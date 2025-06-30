export class HttpException extends Error {
  constructor(
    public status: number,
    public message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error?: Record<string, any>,
  ) {
    super(message);
  }
}
