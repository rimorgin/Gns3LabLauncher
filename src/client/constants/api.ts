/* const MODE = import.meta.env.MODE;
const HOST = import.meta.env.VITE_API_HOST;
const PORT = import.meta.env.VITE_API_PORT;

const httpProtocol =
  MODE === "production" || MODE === "staging" ? "https" : "http";
const wsProtocol = MODE === "production" || MODE === "staging" ? "wss" : "ws";

export const apiBaseUrl = `${httpProtocol}://${HOST}:${PORT}/api/v1`;
export const wsBaseUrl = `${wsProtocol}://${HOST}:${PORT}`;
export const prismaStudioUrl = `${httpProtocol}://${HOST}:5555`; */

const baseOrigin = window.location.origin;

export const apiBaseUrl = `${baseOrigin}/api/v1`;
export const wsBaseUrl = baseOrigin.replace(/^http/, "ws");
export const prismaStudioUrl = `${baseOrigin.split(":").slice(0, 2).join(":")}:5555`;
