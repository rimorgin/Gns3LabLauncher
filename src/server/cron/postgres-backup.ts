import docker from "@srvr/configs/docker.config.ts";
import { envPostgresUrl } from "@srvr/configs/env.config.ts";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import stream from "stream";

const pipeline = promisify(stream.pipeline);

export async function PostgresBackupUtility() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const backupFileName = `postgres-backup-${timestamp}.sql`;

  const container = docker.getContainer("postgres");

  // `pg_dump` command
  const exec = await container.exec({
    Cmd: ["pg_dump", envPostgresUrl],
    AttachStdout: true,
    AttachStderr: true,
  });

  const execStream = await exec.start({ hijack: true, stdin: false });

  // Save to host file system
  const backupPath = path.resolve("/backups", backupFileName); // Adjust to desired host path
  await pipeline(execStream, fs.createWriteStream(backupPath));

  console.log(`✅ Backup saved to ${backupPath}`);
}
