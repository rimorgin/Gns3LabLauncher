import cron from "node-cron";
import { toggleProjectVisibility } from "./toggle-project-visibility.cron.ts";
import { rotateLogs } from "./logs-rotator.cron.ts";
import { PostgresBackupUtility } from "./postgres-backup.ts";
import prisma from "@srvr/utils/db/prisma.ts";

async function isCronJobEnabled(key: string) {
  const job = await prisma.cronJob.findUnique({ where: { key } });
  return job?.enabled ?? false;
}

// Allow admins to modify these settings on frontend

// toggleProjectVisibility — every day at midnight
cron.schedule("0 0 * * *", async () => {
  if (!(await isCronJobEnabled("toggleProjectVisibility"))) return;

  console.log("[CRON] Running toggleProjectVisibility...");
  try {
    await toggleProjectVisibility();
    console.log("[CRON] toggleProjectVisibility finished.");
  } catch (error) {
    console.error("[CRON] toggleProjectVisibility failed:", error);
  }
});

// rotateLogs — every day at 1 AM
cron.schedule("0 1 * * *", async () => {
  if (!(await isCronJobEnabled("rotateLogs"))) return;

  console.log("[CRON] Running rotateLogs...");
  try {
    await rotateLogs();
    console.log("[CRON] rotateLogs finished.");
  } catch (error) {
    console.error("[CRON] rotateLogs failed:", error);
  }
});

// postgresBackup — every day at midnight (check schedule if intentional)
cron.schedule("0 0 * * *", async () => {
  if (!(await isCronJobEnabled("postgresBackup"))) return;

  console.log("[CRON] Running PostgresBackupUtility...");
  try {
    await PostgresBackupUtility();
    console.log("[CRON] PostgresBackupUtility finished.");
  } catch (error) {
    console.error("[CRON] PostgresBackupUtility failed:", error);
  }
});
