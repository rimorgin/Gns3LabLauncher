import { Request, Response, NextFunction } from 'express';
import rateLimiter from '@srvr/configs/rate-limiter.config.ts';
import { MODE } from '@srvr/configs/env.config.ts';

const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (MODE === 'development') return next();
    await rateLimiter.consume((req.ip || req.socket.remoteAddress) ?? 'unknown-ip'); // Consume 1 point per request
    next();
  } catch (rejRes: any) {
    res.status(429).json({
      message: 'Too Many Requests',
      retryAfter: rejRes.msBeforeNext / 1000,
    });
  }
};

export default rateLimiterMiddleware
