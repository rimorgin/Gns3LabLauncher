import * as dotenv from 'dotenv';
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const envServerPort = process.env.PORT;
export const envSessionCookieSecret = process.env.SESSION_COOKIE_SECRET;
export const envMongoDBUsername = process.env.MONGO_INITDB_ROOT_USERNAME;
export const envMongoDBPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
export const envMongoDBHost = process.env.MONGODB_HOST;
export const envMongoDBPort = process.env.MONGODB_PORT;
export const envMongoDBDbname = process.env.MONGODB_DBNAME;
