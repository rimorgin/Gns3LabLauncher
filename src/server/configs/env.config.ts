import * as dotenv from 'dotenv';
import path from 'path'

const MODE = process.env.NODE_ENV


let runEnvFile: string;

if (MODE !== 'production') runEnvFile = '.env.development'
else runEnvFile = '.env.development'


dotenv.config({ path: path.join(process.cwd(), runEnvFile) });

const SESSION_SECRET = process.env.SESSION_COOKIE_SECRET;

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in .env file");
}

export const envServerPort = process.env.PORT;
export const envSessionCookieSecret = SESSION_SECRET;
export const envMongoDBUsername = process.env.MONGO_INITDB_ROOT_USERNAME;
export const envMongoDBPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
export const envMongoDBHost = process.env.MONGODB_HOST;
export const envMongoDBPort = process.env.MONGODB_PORT;
export const envMongoDBDbname = process.env.MONGODB_DBNAME;
