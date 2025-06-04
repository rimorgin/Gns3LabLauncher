import {
  envMongoWebGuiPassword,
  envMongoWebGuiPort,
  envMongoWebGuiUsername,
  envProtocol,
  envServerHost,
} from "@srvr/configs/env.config.ts";
import { createProxyMiddleware } from "http-proxy-middleware";

// create the proxy
export const mongoWebGuiProxyInstance = createProxyMiddleware({
  target: `${envProtocol}://${envServerHost}:${envMongoWebGuiPort}`,
  changeOrigin: true,
  auth: `${envMongoWebGuiUsername}:${envMongoWebGuiPassword}`,
  secure: false, // <--- allow self-signed HTTPS certs
});
