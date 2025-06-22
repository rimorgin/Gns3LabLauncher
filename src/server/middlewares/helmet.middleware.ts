import { MODE } from "@srvr/configs/env.config.ts";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";

export default function helmetMiddleware() {
  if (MODE === "development") {
    // No-op middleware for development
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  // Production & Staging - use Helmet with defaults
  return helmet();
}
