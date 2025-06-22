import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'redis';
import { redisClient } from '@srvr/database/redis.database.ts';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient as unknown as typeof Redis, // type cast as needed
  keyPrefix: 'middleware',
  points: 10, // Number of requests
  duration: 1, // Per second
  blockDuration: 60, // Block for 60s if 10 points consumed
});

export default rateLimiter;
