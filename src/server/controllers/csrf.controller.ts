/**
 * @fileoverview Middleware module for handling CSRF token generation using `csrf-sync`.
 *
 * This module provides a simple Express-compatible handler to generate and return
 * a CSRF token to the client, useful for securing form submissions and API requests.
 *
 * @module csrf.controller
 */

import { csrfSync } from "csrf-sync";
import { Request, Response } from "express";

// Initialize CSRF utilities
const {
  getTokenFromState
} = csrfSync();

/**
 * Express middleware that generates and sends a CSRF token in the response.
 *
 * This is typically used as an API endpoint (e.g., `GET /csrf-token`) to allow clients
 * (such as frontend apps or forms) to request a valid CSRF token before submitting data.
 *
 * @function getCsrf
 * 
 * @param {Request} req - Express request object. Used to derive CSRF token state.
 * @param {Response} res - Express response object to send back the CSRF token.
 * @param {NextFunction} [next] - Optional next middleware function (not used here).
 * 
 * @returns {void} Sends a JSON response containing the CSRF token:
 *  - 200 OK with `{ csrfToken: string }`
 */
export const getCsrf = ((req: Request, res: Response) => {
  const csrfToken = getTokenFromState(req);
  res.json({ csrfToken });
});