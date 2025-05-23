// src/server/middlewares/csrf.middleware.ts
import { NextFunction, Request, Response } from "express";
import { csrfSync } from "csrf-sync";

const {
  generateToken,
  storeTokenInState
} = csrfSync();

// Middleware to generate and store CSRF token
export default function csrfMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.csrfToken) {
    const token = generateToken(req, true);
    storeTokenInState(req, token);
  }
  next();
}


