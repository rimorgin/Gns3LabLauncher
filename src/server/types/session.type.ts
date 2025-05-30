declare module 'express-session' {
  interface SessionData {
    csrfSecret?: string;
    passport?: {
      user: string | Record<string, any>;
    };
  }
}