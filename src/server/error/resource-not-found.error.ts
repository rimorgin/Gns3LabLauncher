import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";

interface MissingResource {
  name: string;
  id?: string;
}

export class ResourceNotFoundError extends Error {
  statusCode: number;
  missing: MissingResource[];

  constructor(resource: MissingResource | MissingResource[]) {
    const resources = Array.isArray(resource) ? resource : [resource];

    const message = resources
      .map((r) => `${r.name}${r.id ? ` (ID: ${r.id})` : ""} not found`)
      .join("; ");

    super(message);

    this.name = "ResourceNotFoundError";
    this.statusCode = HTTP_RESPONSE_CODE.NOT_FOUND;
    this.missing = resources;

    // Preserve proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceNotFoundError);
    }
  }
}
