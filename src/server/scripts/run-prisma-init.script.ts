import { exec } from "child_process";
import {
  MODE,
  runComposeFile,
  runPrismaInitScript,
} from "@srvr/configs/env.config.ts";
import { downAll, upAll } from "docker-compose";

console.log("Environment mode:", MODE);

/**
 * Starts the Docker containers defined in the docker-compose file.
 */
async function startContainers(): Promise<void> {
  console.log("🐳 Starting Docker containers...");
  await upAll({
    cwd: process.cwd(), // root dir where the YAML is
    config: runComposeFile, // e.g. 'docker-compose.dev.yml'
    log: true,
  }).then(
    () => {
      console.log("✅ Containers started:");
    },
    (err) => {
      console.log("❌ Failed to start containers:", err.message);
      process.exit(0);
    },
  );
}

/**
 * Starts the Vite Express application, including certificate generation and Docker container management.
 */
async function startPrismaInit(): Promise<void> {
  await startContainers();

  const initProcess = exec(runPrismaInitScript);

  initProcess.stdout?.on("data", (data) => {
    console.log(`[APP LOG]: ${data}`);
  });

  initProcess.stderr?.on("data", (data) => {
    console.error(`[APP ERR]: ${data}`);
  });

  const shutdown = async () => {
    console.log("\n🛑 Shutting down services gracefully...");

    const shutdownAppProcess = async () => {
      if (initProcess && !initProcess.killed) {
        //console.log("🚀 ~ shutdown ~ appProcess.pid:", initProcess.pid);
        initProcess.kill();
        console.log("✅ Prisma initialization stopped.");
      }
    };
    Promise.all([
      downAll({ cwd: process.cwd(), config: runComposeFile }).catch((err) =>
        console.warn("⚠️ Docker Compose:", err),
      ),
      shutdownAppProcess(),
    ]);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("SIGQUIT", shutdown);
  process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught exception:", err);
    shutdown();
  });
}

startPrismaInit();
