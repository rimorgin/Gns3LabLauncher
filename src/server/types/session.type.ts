declare module 'express-session' {
  interface SessionData {
    csrfSecret?: string;
  }
}
