import prisma from "./prisma.ts";
import { IUserWithRoleInput } from "@srvr/types/models.type.ts";
import { UserService } from "@srvr/features/users/users.service.ts";
import {
  defaultAdminEmailCredential,
  defaultAdminName,
  defaultAdminPasswordCredential,
  defaultAdminUsername,
} from "@srvr/configs/env.config.ts";

// Default cron jobs config
const defaultCronJobs = [
  {
    key: "toggleProjectVisibility",
    name: "Toggle Project Visibility",
    schedule: "0 0 * * *", // every midnight
  },
  {
    key: "rotateLogs",
    name: "Rotate Logs",
    schedule: "0 1 * * *", // every 1 AM
  },
  {
    key: "postgresBackup",
    name: "Postgres Backup",
    schedule: "0 0 * * *", // same as midnight
  },
];

export async function InitAndSeedDb() {
  // seed admin creds
  const isDefaultCredentialsExists = await prisma.user.findUnique({
    where: {
      username: defaultAdminUsername,
    },
  });

  if (!isDefaultCredentialsExists) {
    const defaultUserCredentials: IUserWithRoleInput = {
      name: defaultAdminName,
      email: defaultAdminEmailCredential,
      username: defaultAdminUsername,
      password: defaultAdminPasswordCredential,
      role: "administrator",
    };

    const admin = await UserService.create(defaultUserCredentials);
    console.log("🚀 ~ Postgres ~ Gns3AdminCredentials", admin);
  }
  // seed cron jobs
  for (const job of defaultCronJobs) {
    const exists = await prisma.cronJob.findUnique({ where: { key: job.key } });

    if (!exists) {
      await prisma.cronJob.create({ data: job });
      console.log(`✅ Seeded cron job: ${job.name}`);
    }
  }
}
