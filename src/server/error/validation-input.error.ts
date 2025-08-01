export class ValidationInputError extends Error {
  fields?: string[];

  constructor(fields?: string[] | string) {
    const fieldList = Array.isArray(fields) ? fields : fields ? [fields] : [];

    const message = fieldList.length
      ? `Missing required field${fieldList.length > 1 ? "s" : ""}: ${fieldList.join(", ")}`
      : "Missing required input";

    super(message);
    this.name = "ValidationInputError";
    this.fields = fieldList.length ? fieldList : undefined;
  }
}
