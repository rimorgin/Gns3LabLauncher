import { NextFunction, Request, Response } from "express";
import {
  APP_RESPONSE_MESSAGE,
  HttpStatusCode,
} from "@srvr/configs/constants.config.ts";
import { HttpException } from "@srvr/configs/http-exception.config.ts";

export const notFoundHandler = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  /* const error = new Error("Not Found");
  res.status(404).json({ error: error.message }); */
  next(new HttpException(404, "Not Found"));
};

export default function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let status: number = HttpStatusCode.SERVER_ERROR;
  let message: string = APP_RESPONSE_MESSAGE.serverError;
  let errors: Record<string, unknown> | undefined;

  if (error instanceof HttpException) {
    status = error.status;
    message = error.message;
    errors = error.error;
  } /* else if (isForbiddenError(error)) {
    status = HttpStatusCode.FORBIDDEN;
    message = APP_RESPONSE_MESSAGE.user.invalidCsrfToken;
  } */ else {
    console.error(error);
  }

  res.status(status).json({
    status,
    message,
    ...(errors ? { errors } : {}),
  });
}

function isForbiddenError(error: unknown): error is { name: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ForbiddenError"
  );
}
