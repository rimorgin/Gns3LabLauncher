import dotenv from "dotenv";
import path from "path";
import type { PrismaConfig } from "prisma";

const MODE =
  (process.env.NODE_ENV as "production" | "development" | "staging") ||
  "development";

// Load environment-specific file first, then fallback to .env
dotenv.config({ path: path.join(process.cwd(), `.env.${MODE}`) });

// Debug: Check if environment variables are loaded
console.log("[PRISMA CONFIG] NODE_ENV:", MODE);
console.log(
  "[PRISMA CONFIG] DATABASE_URL defined:",
  !!process.env.POSTGRES_DATABASE_URL,
);

export default {
  schema: path.join(process.cwd(), "prisma"),
} satisfies PrismaConfig;
