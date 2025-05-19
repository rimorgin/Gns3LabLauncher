import { csrfSync } from "csrf-sync";
import { NextFunction, Request, Response } from "express";

const {
  getTokenFromState
} = csrfSync();

// Middleware to generate and store CSRF token
export const getCsrf = ((req: Request, res: Response) => {
  const csrfToken = getTokenFromState(req);
  res.json({ csrfToken });
});
