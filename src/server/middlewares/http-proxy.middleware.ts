import {
  envMongoWebGuiPassword,
  envMongoWebGuiPort,
  envMongoWebGuiUsername,
  envProtocol,
  envServerHost,
} from "@srvr/configs/env.config.ts";
import { createProxyMiddleware } from "http-proxy-middleware";
import { console } from "inspector";

/**
 * Middleware to proxy requests to the MongoDB Web GUI.
 * This allows the frontend to access the MongoDB Web GUI without CORS issues.
 * It uses basic authentication with credentials from environment variables.
 */

console.log(
  "🚀 ~ `${envProtocol}://${envServerHost}:${envMongoWebGuiPort}`:",
  `${envProtocol}://${envServerHost}:${envMongoWebGuiPort}`,
);
console.log(
  "🚀 ~ `${envMongoWebGuiUsername}:${envMongoWebGuiPassword}`:",
  `${envMongoWebGuiUsername}:${envMongoWebGuiPassword}`,
);
export const mongoWebGuiProxyInstance = createProxyMiddleware({
  pathRewrite: (path, req) => {
    const stripped = path
      .replace(/^\/api\/v1\/proxy\/mongo-gui/, "")
      .replace(/^\/public/, "");
    console.log(`[PROXY] Rewriting: ${path} → ${stripped}`);
    return stripped;
  },
  logger: console,
  on: {
    proxyReq(proxyReq, req, res) {
      console.log(`[PROXY REQ] To: ${proxyReq.path}`);
    },
    error(err, req, res) {
      console.error("[PROXY ERROR]:", err);
    },
  },
  target: `${envProtocol}://${envServerHost}:${envMongoWebGuiPort}`,
  changeOrigin: true,
  auth: `${envMongoWebGuiUsername}:${envMongoWebGuiPassword}`,
});
