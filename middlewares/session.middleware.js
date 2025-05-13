const session = require('express-session');
const sessionConfig = require('../config/session.config');

module.exports = session({
  name: sessionConfig.sessionCookieName,
  store: sessionConfig.sessionStore,
  secret: sessionConfig.sessionCookieSecret,
  resave: sessionConfig.sessionResave,
  saveUninitialized: sessionConfig.sessionSaveUninitialized,
  cookie: sessionConfig.sessionCookieOptions
});