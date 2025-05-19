import session from 'express-session'
import sessionConfig from '@srvr/configs/session.config.js'

export default session({
  name: sessionConfig.sessionCookieName,
  store: sessionConfig.sessionStore,
  secret: sessionConfig.sessionCookieSecret,
  resave: sessionConfig.sessionResave,
  saveUninitialized: sessionConfig.sessionSaveUninitialized,
  cookie: sessionConfig.sessionCookieOptions
});