const { RedisStore } = require('connect-redis');
const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',//'100.122.242.48',
    port: 6379
  }
});

// Use an async function to initialize Redis properly
const initializeRedis = async () => {
  try {
    await redisClient.connect(); // Make sure to connect asynchronously
    console.log("Redis connected");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
    process.exit(1); // Exit if Redis connection fails
  }
};

// Initialize Redis client before starting the server
initializeRedis();

// Create RedisStore instance
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'gns3netlab:session:', // Optional prefix for session keys
});

module.exports = redisStore;

