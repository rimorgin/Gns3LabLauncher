import prisma from "@srvr/utils/db/prisma.ts";

export class LogsService {
  static async get() {
    const logs = await prisma.logs.findMany();
    return logs;
  }
}
