/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";

// using ZodTypeAny is a catch-all base type for any Zod schema (z.string(), z.object(...),

/**
 * Express middleware that validates the request body against a provided Zod schema.
 *
 * This utility ensures incoming data conforms to the expected structure before
 * reaching your route handlers. It supports any Zod schema type, including
 * refined or transformed schemas like `z.object(...).refine(...)`.
 *
 * If validation fails, it sends a 400 response with a list of validation errors.
 * If an unexpected error occurs, it responds with a 500 status.
 *
 * @param {ZodTypeAny} schema - A Zod schema to validate the `req.body` against.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - An Express middleware function.
 *
 * @example
 * import { z } from "zod";
 * const schema = z.object({
 *   username: z.string().min(3),
 *   age: z.number().int().positive(),
 * });
 * app.post("/register", validateData(schema), (req, res) => {
 *   // req.body is now guaranteed to match the schema
 * });
 */
export function validateData(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
