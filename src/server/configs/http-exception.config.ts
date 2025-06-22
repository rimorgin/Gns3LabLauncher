export class HttpException extends Error {
  constructor(
    public status: number,
    public message: string,
    public error?: Record<string, any>
  ) {
    super(message);
  }
}
