import prisma from "@srvr/utils/db/prisma.ts";
import { exec } from "child_process";
import { InitAndSeedDb } from "@srvr/utils/db/init-seed-db.ts";

const checkPostgresHealth = () =>
  new Promise<boolean>((resolve) => {
    exec(
      `docker exec postgres psql -U gns3adminpostgres -d Gns3LabLauncher -c "SELECT 1;"`,
      (error, stdout, stderr) => {
        if (error || stderr) {
          return resolve(false);
        }
        resolve(stdout.includes("1"));
      },
    );
  });

export default async function Postgres(maxRetries = 10, interval = 2000) {
  let isPostgresHealthy = false;
  let retries = 0;

  while (!isPostgresHealthy && retries < maxRetries) {
    try {
      const healthy = await checkPostgresHealth();
      if (healthy) {
        console.log("✅ PostgreSQL is healthy");
        isPostgresHealthy = true;
        break;
      }
    } catch (err) {
      console.log("❌ Error checking PostgreSQL health:", err);
    }

    retries++;
    console.log(`⏳ Waiting for PostgreSQL... (${retries}/${maxRetries})`);
    await new Promise((res) => setTimeout(res, interval));
  }

  if (!isPostgresHealthy) {
    console.error("❌ PostgreSQL did not become healthy in time.");
    process.exit(1);
  }

  /* 
    it is not necessary to call $connect() thanks to the lazy connect behavior.
    but it is needed for the first request to respond instantly and cannot wait 
    for a lazy connection to be established
  */
  const connection = prisma.$connect;

  if (!connection) {
    console.error("❌ PostgreSQL is healthy but Prisma Client did not connect");
    process.exit(1);
  }

  console.log(`✅ PostgreSQL connected`);

  await InitAndSeedDb();
}
