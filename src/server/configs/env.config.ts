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

export const envMongoDBUsername = process.env.MONGO_INITDB_ROOT_USERNAME;
export const envMongoDBPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
export const envMongoDBHost = process.env.MONGODB_HOST;
export const envMongoDBPort = process.env.MONGODB_PORT;
export const envMongoDBDbname = process.env.MONGODB_DBNAME;

export const envMongoWebGuiUsername =
  process.env.VITE_MONGOWEBGUI_ADMIN_USERNAME;
export const envMongoWebGuiPassword =
  process.env.VITE_MONGOWEBGUI_ADMIN_PASSWORD;
export const envMongoWebGuiPort = process.env.VITE_MONGOWEBGUI_PORT;
