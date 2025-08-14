import * as dotenv from "dotenv";
import path from "path";
import { z } from "zod";
import fs from "fs";
import { ModeTypes } from "@srvr/types/global.type.ts";

// Environment mode setup
export const MODE = (process.env.NODE_ENV as ModeTypes) || "development";

// File and script configurations
export const runComposeFile =
  MODE === "development" ? "docker-compose.dev.yml" : "docker-compose.yml";
export const runEnvFile = `.env.${MODE}`;
export const runScript =
  MODE === "development"
    ? "nodemon -w src/ -x tsx src/server/main.ts"
    : "tsx src/server/main.ts";
export const runPrismaInitScript =
  MODE === "development" ? "yarn run prisma:init:dev" : "yarn run prisma:init";

// Check for required files before loading dotenv
if (!fs.existsSync(runEnvFile)) {
  throw new Error(
    `No .env file found in your directory ${MODE} mode. Please create one.`,
  );
}

if (!fs.existsSync(runComposeFile)) {
  throw new Error(
    `No docker-compose file found for ${MODE} mode. Please create one.`,
  );
}

// Load environment variables
dotenv.config({
  path: path.join(process.cwd(), runEnvFile),
  debug: MODE === "development",
});

// Define the environment schema with Zod
const envSchema = z.object({
  // Required environment variables

  // POSTGRES configuration
  ROOT_DATA_DIR: z.string().min(1, "App directory must be specified"),
  POSTGRES_DATABASE_URL: z.string().url("Invalid database URL"),
  POSTGRES_USER: z.string().min(1, "Database user must be defined"),
  POSTGRES_PASSWORD: z.string().min(1, "Database password must be defined"),
  POSTGRES_DB: z.string().min(1, "Database name must be defined"),
  POSTGRES_HOST: z.string().min(1, "Postgres host must be defined"),
  POSTGRES_PORT: z.string().transform(Number).pipe(z.number().positive()),
  POSTGRES_SCHEMA: z.string().default("public"),

  // REDIS configuration
  REDIS_HOST: z.string().min(1, "Redis host must be defined"),
  REDIS_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive("Redis port must be a positive number")),
  REDIS_PASSWORD: z.string().min(1, "Redis password must be defined"),

  // COOKIE
  SESSION_COOKIE_SECRET: z
    .string()
    .min(1, "Session cookie secret must be defined"),

  // Optional environment variables with defaults
  DEFAULT_ADMIN_NAME: z.string().default("Gns3 Lab Admin"),
  DEFAULT_ADMIN_USERNAME: z.string().default("gns3labadmin"),
  DEFAULT_ADMIN_EMAIL_CREDENTIAL: z
    .string()
    .email()
    .default("default@admin.net"),
  DEFAULT_ADMIN_PASSWORD_CREDENTIAL: z.string().default("default@password"),

  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default("5000"),
});

// Validate environment variables
const validationResult = envSchema.safeParse(process.env);

if (!validationResult.success) {
  console.error("❌ Environment validation failed:");
  validationResult.error.errors.forEach((error) => {
    console.error(`  ${error.path.join(".")}: ${error.message}`);
  });
  process.exit(1);
}

// Export validated environment
const env = validationResult.data;
console.log("🚀 ~ env:", env);

// Export individual variables (keeping the same interface)
export const defaultAdminName = env.DEFAULT_ADMIN_NAME;
export const defaultAdminUsername = env.DEFAULT_ADMIN_USERNAME;
export const defaultAdminEmailCredential = env.DEFAULT_ADMIN_EMAIL_CREDENTIAL;
export const defaultAdminPasswordCredential =
  env.DEFAULT_ADMIN_PASSWORD_CREDENTIAL;
export const envAppDir = env.ROOT_DATA_DIR;
export const envProtocol =
  MODE === "production" || MODE === "staging" ? "https" : "http";
export const envServerPort = env.PORT;
export const envSessionCookieSecret = env.SESSION_COOKIE_SECRET;
export const envRedisHost = env.REDIS_HOST;
export const envRedisPort = env.REDIS_PORT;
export const envRedisPassword = env.REDIS_PASSWORD;
export const envPostgresHost = env.POSTGRES_HOST;
export const envPostgresPort = env.POSTGRES_PORT;
export const envPostgresUsername = env.POSTGRES_USER;
export const envPostgresPassword = env.POSTGRES_PASSWORD;
export const envPostgresDb = env.POSTGRES_DB;
export const envPostgresSchema = env.POSTGRES_SCHEMA;
export const envPostgresUrl = env.POSTGRES_DATABASE_URL;

// Export the complete validated environment object
export { env };

// Export the inferred type for TypeScript users
export type Env = z.infer<typeof envSchema>;
