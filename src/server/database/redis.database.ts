
import { exec } from "child_process";
import { RedisStore } from "connect-redis";
import redis from 'redis';

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',//'100.122.242.48',
    port: 6379
  }
});

const checkRedisHealth = () =>
  new Promise((resolve) => {
    exec(
      "docker exec redis redis-cli ping",
      (error, stdout, stderr) => {
        if (error || stderr || !stdout.includes("PONG")) {
          return resolve(false);
        }
        resolve(true);
      }
    );
  });

// Use an async function to initialize Redis properly
const initializeRedis = async () => {
  let isRedisHealthy: boolean = false;

  while(!isRedisHealthy) {
    try {
      const healthy = await checkRedisHealth();
      if (healthy) {
        console.log("✅ Redis is healthy")
        isRedisHealthy = true
      }
    } catch {
      console.log('⏳ Waiting for Redis...');
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
  try {
    await redisClient.connect(); // Make sure to connect asynchronously
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Error connecting to Redis:", err);
    process.exit(1); // Exit if Redis connection fails
  }
};

// Initialize Redis client before starting the server
initializeRedis();

// Create RedisStore instance
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'gns3lab:session:', // Optional prefix for session keys
});

export { redisStore, redisClient };

