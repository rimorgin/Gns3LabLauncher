import * as dotenv from "dotenv";
import path from "path";
import { ModeTypes } from "@srvr/types/global.type.ts";
import fs from "fs";

export const MODE = (process.env.NODE_ENV as ModeTypes) || "development";

export const runComposeFile =
  MODE === "development" ? "docker-compose.dev.yml" : "docker-compose.yml";
export const runEnvFile = `.env.${MODE}`;
export const runScript =
  MODE === "production" || MODE === "staging"
    ? `yarn run ${MODE}`
    : "yarn run dev";


if (!fs.existsSync(runEnvFile)) {
  throw new Error(
    `No .env file found in your directory ${MODE} mode. Please create one.`
  );
}

if (!fs.existsSync(runComposeFile)) {
  throw new Error(
    `No docker-compose file found for ${MODE} mode. Please create one.`,
  );
}

dotenv.config({
  path: path.join(process.cwd(), runEnvFile),
  debug: MODE === "development",
});
  


export const envProtocol =
  MODE === "production" || MODE === "staging" ? "https" : "http";
export const envServerHost = process.env.VITE_API_HOST;
export const envServerPort = process.env.PORT;
export const envSessionCookieSecret =
  process.env.SESSION_COOKIE_SECRET ||
  "nuaiwnudnj123wer41nrgjnerjsuneruknuNPAISUDNun<sodfnseeoin[AISN{OI";

export const envRedisHost = process.env.REDIS_HOST;
export const envRedisPort = process.env.REDIS_PORT;
export const envRedisPassword = process.env.REDIS_PASSWORD;

export const envPostgresHost = process.env.POSTGRES_HOST;
export const envPostgresPort = process.env.POSTGRES_PORT;
export const envPostgresUsername = process.env.POSTGRES_USER;
export const envPostgresPassword = process.env.POSTGRES_PASSWORD;
export const envPostgresDb = process.env.POSTGRES_DB;
export const envPostgresSchema = process.env.POSTGRES_SCHEMA || "public";
export const envPostgresUrl =  `postgresql://${envPostgresUsername}:${envPostgresPassword}@${envPostgresHost}:${envPostgresPort}/${envPostgresDb}?schema=${envPostgresSchema}`;
