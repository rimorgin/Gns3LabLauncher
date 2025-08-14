import { NextFunction, Request, Response } from "express";
import {
  APP_RESPONSE_MESSAGE,
  HttpStatusCode,
} from "@srvr/configs/constants.config.ts";
import { HttpException } from "@srvr/error/http-exception.error.ts";
import { UnauthenticatedRequestError } from "@srvr/error/unauthenticated.error.ts";
import { ValidationInputError } from "@srvr/error/validation-input.error.ts";
import {
  LateSubmissionNotAllowedError,
  MaxAttemptsReachedError,
} from "@srvr/error/max-attempt-submission.error.ts";
import { DuplicateUserError } from "@srvr/error/duplicate-entity.error.ts";
import { ResourceNotFoundError } from "@srvr/error/resource-not-found.error.ts";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new HttpException(
    HttpStatusCode.NOT_FOUND,
    APP_RESPONSE_MESSAGE.server.notFound,
    {
      path: req.path,
      method: req.method,
      ...(req.headers["x-request-id"] && {
        requestId: req.headers["x-request-id"],
      }),
    },
  );
  next(error);
};

export default function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  let status: number = HttpStatusCode.SERVER_ERROR;
  let message: string = APP_RESPONSE_MESSAGE.server.error;
  let errors: Record<string, unknown> | undefined;

  // Handle other known error types
  if (error instanceof UnauthenticatedRequestError) {
    status = HttpStatusCode.UNAUTHORIZED;
    message = error.message;
  } else if (error instanceof ValidationInputError) {
    status = HttpStatusCode.BAD_REQUEST;
    message = error.message;
  } else if (error instanceof MaxAttemptsReachedError) {
    status = HttpStatusCode.CONFLICT;
    message = error.message;
  } else if (error instanceof LateSubmissionNotAllowedError) {
    status = HttpStatusCode.FORBIDDEN; // or BAD_REQUEST
    message = error.message;
  } else if (error instanceof DuplicateUserError) {
    status = HttpStatusCode.CONFLICT;
    message = error.message;
  } else if (error instanceof ResourceNotFoundError) {
    status = error.statusCode;
    message = error.message;
    // handle CSRF Error
  } else if (isForbiddenError(error)) {
    status = HttpStatusCode.FORBIDDEN;
    message = APP_RESPONSE_MESSAGE.user.invalidCsrfToken;
    // Handle HttpException (keep existing logic)
  } else if (error instanceof HttpException) {
    status = error.status;
    message = error.message;
    errors = error.error;
  }
  // Handle unexpected errors
  else {
    // Log unexpected errors for debugging
    console.error("Unexpected error:", error);

    // In production, don't expose internal error details
    if (process.env.NODE_ENV === "production") {
      message = "Something went wrong";
    } else {
      message = error instanceof Error ? error.message : "Unknown error";
    }
  }

  res.status(status).json({
    status,
    message,
    ...(errors ? { errors } : {}),
    // Add request ID for easier debugging
    ...(req.headers["x-request-id"]
      ? { requestId: req.headers["x-request-id"] }
      : {}),
  });
}

// Helper functions
function isForbiddenError(error: unknown): error is { name: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ForbiddenError"
  );
}

// Usage in controllers:
// export const submitLab = asyncHandler(async (req: Request, res: Response) => {
//   // Your controller logic here - no need for try/catch!
// });

// Async error wrapper utility (optional)
export const asyncHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
