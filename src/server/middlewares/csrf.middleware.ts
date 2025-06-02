import { NextFunction, Request, Response } from "express";
import { csrfSync } from "csrf-sync";

const { generateToken, storeTokenInState } = csrfSync();

export default function csrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session) {
    throw new Error("Session middleware must be initialized before csrfMiddleware.");
  }

  if (!req.session.csrfSecret) {
    const token = generateToken(req, true);
    storeTokenInState(req, token); // This will save secret in req.session.csrfSecret
  }

  next();
}
