import { Request, Response, NextFunction } from "express";
import rateLimiter from "@srvr/configs/rate-limiter.config.ts";
import { MODE } from "@srvr/configs/env.config.ts";
import { logger } from "./logger.middleware.ts";

const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (MODE === "development") return next();
    await rateLimiter.consume(
      (req.ip || req.socket.remoteAddress) ?? "unknown-ip",
    );
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

    // ⬇️ Log the 429 event manually here
    logger.warn("Too Many Requests", {
      context: req.user?.username || "anonymous",
      message: `Rate limit exceeded: ${req.method} ${req.path}`,
      ip: req.ip?.includes("::ffff:") ? req.ip?.replace("::ffff:", "") : req.ip,
      statusCode: 429,
      stack: {
        userAgent: req.headers["user-agent"],
      },
    });

    res.status(429).json({
      message: "Too Many Requests",
      retryAfter,
    });
  }
};

export default rateLimiterMiddleware;
