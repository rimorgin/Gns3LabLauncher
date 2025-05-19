// src/server/middlewares/csrf.middleware.ts
import express, { NextFunction, Request, Response } from "express";
import { csrfSync } from "csrf-sync";

const {
  generateToken,
  storeTokenInState
} = csrfSync();

// Middleware to generate and store CSRF token
export default function csrfMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.csrfToken) {
    const token = generateToken(req);
    storeTokenInState(req, token);
  }
  next();
}

export function verifyCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const csrfFromBody = req.body._csrf || req.headers['x-csrf-token'];

  if (!req.csrfToken || req.csrfToken() !== csrfFromBody) {
    console.warn('🚨 Invalid CSRF token', {
      expected: req.csrfToken?.(),
      received: csrfFromBody,
    });
    res.status(403).json({ message: 'Invalid CSRF token' });
    return;
  }


  next();
}

