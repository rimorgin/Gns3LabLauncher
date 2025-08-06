import prisma from "@srvr/utils/db/prisma.ts";

export const CronService = {
  async getAll() {
    return prisma.cronJob.findMany();
  },

  async getByKey(key: string) {
    return prisma.cronJob.findUnique({ where: { key } });
  },

  async updateEnabled(key: string, enabled: boolean) {
    return prisma.cronJob.update({
      where: { key },
      data: { enabled },
    });
  },

  async updateJob(key: string, data: { name?: string; schedule?: string }) {
    return prisma.cronJob.update({
      where: { key },
      data,
    });
  },
};
