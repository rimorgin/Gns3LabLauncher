import prisma from "@srvr/utils/db/prisma.ts";
import { isPast } from "date-fns";

export async function toggleProjectVisibility() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        visible: true,
        duration: {
          not: null,
        },
      },
    });

    for (const project of projects) {
      const durationEnd = new Date(project.duration!); // Assuming it's a string or ISO

      if (isPast(durationEnd)) {
        await prisma.project.update({
          where: { id: project.id },
          data: { visible: false },
        });
        console.log(`[CRON] Project ${project.projectName} set to hidden.`);
      }
    }
  } catch (err) {
    console.error("[CRON ERROR] toggleProjectVisibility:", err);
  }
}
