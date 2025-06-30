import { NextFunction, Request, Response } from "express";
import { generateToken, storeTokenInState } from "@srvr/configs/csrf.config.ts";

export default function csrfTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session) {
    throw new Error(
      "Session middleware must be initialized before csrfMiddleware.",
    );
  }

  // Always generate a new token based on current session
  const token = generateToken(req);
  storeTokenInState(req, token);

  next();
}
