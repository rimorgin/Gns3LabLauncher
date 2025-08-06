import prisma from "@srvr/utils/db/prisma.ts";

export async function rotateLogs() {
  const daysToKeep = 30;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  try {
    const deleted = await prisma.logs.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });

    console.log(
      `[CRON] Deleted ${deleted.count} logs older than ${daysToKeep} days.`,
    );
  } catch (error) {
    console.error("[CRON] Failed to rotate logs:", error);
  }
}
