import { csrfSync } from "csrf-sync";

export const {
  generateToken,
  storeTokenInState,
  getTokenFromState,
  csrfSynchronisedProtection,
} = csrfSync({
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});
