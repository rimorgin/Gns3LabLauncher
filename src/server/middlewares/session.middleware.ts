import session from 'express-session'
import sessionConfig from '@srvr/configs/session.config.ts'

// Configure and export the session middleware
export default session({
  // The name of the session cookie sent to the client
  name: sessionConfig.sessionCookieName,

  // Where to store session data (e.g., in-memory, Redis, etc.)
  store: sessionConfig.sessionStore,

  // Secret used to sign the session ID cookie
  secret: sessionConfig.sessionCookieSecret,

  // Forces the session to be saved back to the store, even if unmodified
  resave: sessionConfig.sessionResave,

  // Prevents saving uninitialized sessions (recommended for performance)
  saveUninitialized: sessionConfig.sessionSaveUninitialized,

  // Configuration options for the session cookie itself
  cookie: sessionConfig.sessionCookieOptions
});