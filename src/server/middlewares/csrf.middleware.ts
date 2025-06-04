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

  if (!req.session.csrfToken) {
    const token = generateToken(req, true);
    storeTokenInState(req, token); // This will save secret in req.session.csrfSecret
  }

  next();
}
