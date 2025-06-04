import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { MODE, runEnvFilePath, runScript } from "@srvr/configs/env.config.ts";

console.log("Environment mode:", MODE);

const execAsync = promisify(exec);

// Create certs if in production
async function createCertsIfNeeded(): Promise<void> {
  if (MODE === "development") return;

  const certDir = path.resolve(process.cwd(), "cert");
  const services = ["vite-express", "mongo-gui"];

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
          `mkcert -key-file ${keyPath} -cert-file ${certPath} localhost 127.0.0.1 ::1`,
        );

        console.log(`✅ HTTPS certs generated for ${service}`);
      }
    }
  } catch (err: any) {
    console.error("❌ Failed to generate certificates:", err.message);
  }
}

// Starts Docker containers
async function startContainers(): Promise<void> {
  console.log("🐳 Starting Docker containers...");
  try {
    const { stdout, stderr } = await execAsync(
      `docker compose -f docker-compose.yml --env-file ${runEnvFilePath} up -d`,
    );
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error: any) {
    console.error(
      "❌ Failed to start containers:",
      error.stderr || error.message,
    );
    throw error;
  }
}

// Starts the application
async function startViteExpress(): Promise<void> {
  try {
    await createCertsIfNeeded();
  } catch {
    console.error("🚨 Certificate generation failed. Aborting startup.");
    process.exit(0);
  }

  await startContainers();

  const appProcess = exec(runScript);

  appProcess.stdout?.on("data", (data) => {
    console.log(`[APP LOG]: ${data}`);
  });

  appProcess.stderr?.on("data", (data) => {
    console.error(`[APP ERR]: ${data}`);
  });

  const shutdown = () => {
    console.log("\n🛑 Shutting down services gracefully...");
    exec("rm -rf /home/rimor/Documents/VSCodes/Gns3LabLauncher/cert", (err) => {
      if (err) {
        console.warn("⚠️ Error removing dir: ", err.message);
      } else {
        console.log("✅ cert directory removed");
      }
    });
    exec(
      `docker compose -f docker-compose.yml --env-file ${runEnvFilePath} down`,
      (err) => {
        if (err) {
          console.warn("⚠️ Error stopping containers:", err.message);
        } else {
          console.log("✅ All containers stopped.");
        }
        process.exit(0);
      },
    );
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
