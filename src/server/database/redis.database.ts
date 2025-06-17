import {
  envRedisHost,
  envRedisPassword,
  envRedisPort,
} from "@srvr/configs/env.config.ts";
import { exec } from "child_process";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

/* COMMON ERROR 
 1:C 17 Jun 2025 07:42:27.043 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect. 
*/

// Create Redis client
const redisClient = createClient({
  socket: {
    host: envRedisHost,
    port: envRedisPort ? parseInt(envRedisPort) : 6379, //fallback to default
  },
  password: envRedisPassword,
});

const checkRedisHealth = () =>
  new Promise((resolve) => {
    exec(
      `docker exec redis redis-cli --pass ${envRedisPassword} ping`,
      (error, stdout, stderr) => {
        stdout = stdout.trim();
        stderr = stderr.trim();
        //console.log("stdout:", cleanStdout);
        //console.log("stderr:", cleanStderr);

        const harmlessWarning =
          "Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.";

        if (error || (stderr && stderr !== harmlessWarning)) {
          return resolve(false);
        }

        resolve(stdout === "PONG");
      },
    );
  });

// Use an async function to initialize Redis properly
export default async function Redis() {
  let isRedisHealthy = false;

  while (!isRedisHealthy) {
    try {
      const healthy = await checkRedisHealth();
      if (healthy) {
        console.log("✅ Redis is healthy");
        isRedisHealthy = true;
        break;
      }
    } catch (err) {
      console.log("❌ Error checking Redis health:", err);
    }

    console.log("⏳ Waiting for Redis...");
    await new Promise((res) => setTimeout(res, 2000));
  }

  try {
    await redisClient.connect(); // This will now run after health is confirmed
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Error connecting to Redis:", err);
    process.exit(1);
  }
}

// Initialize Redis client before starting the server
//initializeRedis();

// Create RedisStore instance
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "gns3lab:session:", // Optional prefix for session keys
});

export { redisStore, redisClient };
