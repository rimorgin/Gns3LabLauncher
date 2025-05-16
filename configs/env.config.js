const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });


module.exports = {
  envSessionCookieSecret: process.env.SESSION_COOKIE_SECRET,
  envMongoDBUsername: process.env.MONGO_INITDB_ROOT_USERNAME,
  envMongoDBPassword: process.env.MONGO_INITDB_ROOT_PASSWORD,
  envMongoDBHost: process.env.MONGODB_HOST,
  envMongoDBPort: process.env.MONGODB_PORT,
  envMongoDBDbname: process.env.MONGODB_DBNAME
};
