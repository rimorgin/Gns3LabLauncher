import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import {
  envServerHost,
  MODE,
  runComposeFile,
  runEnvFile,
  runScript,
} from "@srvr/configs/env.config.ts";
import { onProcessShutdownStopGns3Containers } from "@srvr/utils/docker-run.utils.ts";

console.log("Environment mode:", MODE);
console.log("MAP HOST: ", process.env.OPENVPN_STATIC_HOST_MAPPINGS);

const execAsync = promisify(exec);

/**
 * Creates self-signed certificates if the application is running in staging mode.
 * DONT USE SELF-SIGNED CERTS IN PRODUCTION
 */
async function createCertsIfNeeded(): Promise<void> {
  if (MODE !== "staging") return;

  const certDir = path.resolve(process.cwd(), "cert");
  const services = ["vite-express"];

  try {
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }

    for (const service of services) {
      const keyPath = path.join(certDir, `${service}.key.pem`);
      const certPath = path.join(certDir, `${service}.cert.pem`);

      const keyExists = fs.existsSync(keyPath);
      const certExists = fs.existsSync(certPath);

      if (!keyExists || !certExists) {
        console.log(`🔐 Generating self-signed HTTPS certs for ${service}...`);

        await execAsync(
          `mkcert -key-file ${keyPath} -cert-file ${certPath} ${envServerHost} localhost 127.0.0.1 ::1`,
        );
        console.log("🚀 ~ createCertsIfNeeded ~ envServerHost:", envServerHost);

        console.log(`✅ HTTPS certs generated for ${service}`);
      }
    }
  } catch (error: unknown) {
    console.error(
      "❌ Failed to generate certificates:",
      (error as { message: string }).message,
    );
    throw new Error(
      "Please ensure mkcert is installed and configured correctly.",
    );
  }
}

/**
 * Starts the Docker containers defined in the docker-compose file.
 */
async function startContainers(): Promise<void> {
  console.log("🐳 Starting Docker containers...");
  try {
    const { stdout, stderr } = await execAsync(
      `docker compose -f ${runComposeFile} --env-file ${runEnvFile} up -d`,
    );
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error: unknown) {
    console.error(
      "❌ Failed to start containers:",
      (error as { stderr?: string; message?: string }).stderr ||
        (error as { message?: string }).message,
    );
    throw error;
  }
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
  try {
    await createCertsIfNeeded();
  } catch (error: unknown) {
    console.error(
      "🚨 Certificate generation failed. Aborting startup.",
      (error as { message: string }).message,
    );
    process.exit(0);
  }

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
      execAsync(
        `docker compose -f ${runComposeFile} --env-file ${runEnvFile} down`,
      )
        .then(() => console.log("✅ All dependent containers stopped."))
        .catch((err) =>
          console.warn("⚠️ Error stopping containers:", err.message),
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
