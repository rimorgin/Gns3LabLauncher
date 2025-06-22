// error.middleware
import { NextFunction, Request, Response } from "express";
import { APP_RESPONSE_MESSAGE, HttpStatusCode } from "@srvr/configs/constants.config.ts";
import { HttpException } from "@srvr/configs/http-exception.config.ts";

export const notFoundHandler = function (
  req: Request,
  res: Response,
  //next: NextFunction
) {
  const error = new Error("Not Found");
  res.status(404).json({ error: error.message });
};

export const errorHandler = function (err: Error, req: Request, res: Response) {
  console.error(err);
  res.status(500).json({ error: err.message });
};


export default function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = HttpStatusCode.SERVER_ERROR;
  let message = APP_RESPONSE_MESSAGE.serverError;
  let errors: any = undefined;

  if (error instanceof HttpException) {
    status = error.status;
    message = error.message;
    errors = error.error;
  } else if ((error as any)?.name === "ForbiddenError") {
    status = HttpStatusCode.FORBIDDEN;
    message = APP_RESPONSE_MESSAGE.invalidCsrfToken;
  } else {
    console.error(error);
  }

  res.status(status).json({
    status,
    message,
    ...(errors && { errors }),
  });
  return
}