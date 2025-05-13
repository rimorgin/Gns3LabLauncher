const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
    envSessionCookieSecret: process.env.SESSION_COOKIE_SECRET,
};
