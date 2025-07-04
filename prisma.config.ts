import dotenv from "dotenv";
import path from "path";
import type { PrismaConfig } from "prisma";

const MODE =
  (process.env.NODE_ENV as "production" | "development" | "staging") ||
  "development";

dotenv.config({ path: path.join(__dirname, `.env.${MODE}`) });

export default {
  earlyAccess: true,
  schema: path.join("prisma"),
} satisfies PrismaConfig;
