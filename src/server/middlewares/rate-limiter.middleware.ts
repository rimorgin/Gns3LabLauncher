import { Request, Response, NextFunction } from "express";
import rateLimiter from "@srvr/configs/rate-limiter.config.ts";
import { MODE } from "@srvr/configs/env.config.ts";

const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (MODE === "development") return next();
    await rateLimiter.consume(
      (req.ip || req.socket.remoteAddress) ?? "unknown-ip",
    ); // Consume 1 point per request
    next();
  } catch (rejRes: unknown) {
    let retryAfter = 0;
    if (
      typeof rejRes === "object" &&
      rejRes !== null &&
      "msBeforeNext" in rejRes &&
      typeof (rejRes as { msBeforeNext: unknown }).msBeforeNext === "number"
    ) {
      retryAfter = (rejRes as { msBeforeNext: number }).msBeforeNext / 1000;
    }
    res.status(429).json({
      message: "Too Many Requests",
      retryAfter,
    });
  }
};

export default rateLimiterMiddleware;
