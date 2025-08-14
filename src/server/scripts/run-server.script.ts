import { exec, spawn } from "child_process";
import { MODE, runComposeFile, runScript } from "@srvr/configs/env.config.ts";
import { downAll, upAll } from "docker-compose";
import { onProcessShutdownStopGns3Containers } from "@srvr/utils/docker-run.utils.ts";

console.log("Environment mode:", MODE);
console.log("MAP HOST: ", process.env.OPENVPN_STATIC_HOST_MAPPINGS);

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
 * Starts the prisma studio for data library
 */
let prismaStudioProcess: ReturnType<typeof spawn> | null = null;

async function startPrismaStudio(): Promise<void> {
  console.log("Starting Prisma Studio...");

  prismaStudioProcess = spawn("yarn", ["run", "prisma:studio"], {
    stdio: "inherit",
    shell: true,
  });
}

/**
 * Starts the Vite Express application, including certificate generation and Docker container management.
 */
async function startViteExpress(): Promise<void> {
  await startContainers();
  await startPrismaStudio();

  const appProcess = exec(runScript);

  appProcess.stdout?.on("data", (data) => {
    console.log(`[APP LOG]: ${data}`);
  });

  appProcess.stderr?.on("data", (data) => {
    console.error(`[APP ERR]: ${data}`);
  });

  const shutdown = async () => {
    console.log("\n🛑 Shutting down services gracefully...");
    const shutdownPrismaStudio = async () => {
      if (
        prismaStudioProcess &&
        prismaStudioProcess.pid &&
        !prismaStudioProcess.killed
      ) {
        console.log(
          "🚀 ~ shutdown ~ prismaStudioProcess.pid:",
          prismaStudioProcess.pid,
        );

        await prismaStudioProcess.kill();
        console.log("✅ Prisma Studio stopped.");
      }
    };
    const shutdownAppProcess = async () => {
      if (appProcess && !appProcess.killed) {
        console.log("🚀 ~ shutdown ~ appProcess.pid:", appProcess.pid);
        appProcess.kill();
        console.log("✅ Vite Express application stopped.");
      }
    };
    Promise.all([
      shutdownPrismaStudio(),
      onProcessShutdownStopGns3Containers(),
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

startViteExpress();
