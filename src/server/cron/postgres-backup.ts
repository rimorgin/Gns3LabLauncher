import docker from "@srvr/configs/docker.config.ts";
import {
  envAppDir,
  envPostgresDb,
  envPostgresHost,
  envPostgresPassword,
  envPostgresPort,
  envPostgresUsername,
} from "@srvr/configs/env.config.ts";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import stream from "stream";
import { mkdirp } from "mkdirp";

const pipeline = promisify(stream.pipeline);

export async function PostgresBackupUtility() {
  // Mounted inside Docker and mapped to host
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");

  const backupDir = path.resolve(envAppDir, "db", "pg_backups");
  const backupFileName = `postgres-backup-${timestamp}.bak`;
  const backupPath = path.join(backupDir, backupFileName);

  try {
    // Ensure directory exists (mkdirp handles this gracefully)
    await mkdirp(backupDir);

    const container = docker.getContainer("postgres");

    const exec = await container.exec({
      Cmd: [
        "pg_dump",
        "-U",
        envPostgresUsername,
        "-h",
        envPostgresHost,
        "-p",
        envPostgresPort.toString(),
        "-d",
        envPostgresDb,
      ],
      Env: [`PGPASSWORD=${envPostgresPassword}`],

      AttachStdout: true,
      AttachStderr: true,
    });

    const execStream = await exec.start({ hijack: true, stdin: false });

    await pipeline(execStream, fs.createWriteStream(backupPath));

    console.log(`✅ PostgreSQL backup saved to: ${backupPath}`);
  } catch (err) {
    console.error("❌ Failed to create PostgreSQL backup:", err);
    throw err;
  }
}

/* PostgresBackupUtility()
  .then(() => console.log("PostgreSQL backup completed successfully."))
  .catch((err) => {
    console.error("PostgreSQL backup failed:", err);
    process.exit(1);
  }); */
