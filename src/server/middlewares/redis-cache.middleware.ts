import { redisClient } from '@srvr/database/redis.database.ts';
import { Request, Response, NextFunction } from 'express';

/* 
  Middleware to cache frequently used api routes with maximum expiry of 3hours
  @param {ttl} specify a custom expiry of cache
*/
export const redisCache = (ttl = 10800) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') return next();
    const key = `gns3labroutes:cache:${req.originalUrl}@${req.user?._id}`;

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.json(JSON.parse(cached));
        return; 
      }

      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        redisClient
          .setEx(key, ttl, JSON.stringify(body))
          .catch((err) => console.warn('[Redis Cache] setEx error', err));

        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('[Redis Cache] Error:', err);
      next(); // always call next if an error occurs
    }
  };
};