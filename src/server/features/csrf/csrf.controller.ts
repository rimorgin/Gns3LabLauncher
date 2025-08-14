/**
 * @fileoverview Middleware module for handling CSRF token generation using `csrf-sync`.
 *
 * This module provides a simple Express-compatible handler to generate and return
 * a CSRF token to the client, useful for securing form submissions and API requests.
 *
 * @module csrf.controller
 */

import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";
import { getTokenFromState } from "@srvr/configs/csrf.config.ts";
import { Request, Response } from "express";

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
export const getCsrf = (req: Request, res: Response) => {
  try {
    const csrfToken = getTokenFromState(req);

    if (!csrfToken) {
      return res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
        error: "Failed to generate CSRF token. Session may not be initialized.",
      });
    }

    res.json({ csrfToken });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      error: "Internal server error while generating CSRF token",
    });
  }
};
