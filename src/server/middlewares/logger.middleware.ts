import { PostgresTransport } from "@innova2/winston-pg";
import { envPostgresUrl, MODE } from "@srvr/configs/env.config.ts";
import { NextFunction, Request, Response } from "express";
import winston from "winston";

const { combine, timestamp, printf } = winston.format;
interface MyLogTable {
  id: number;
  level: string;
  timestamp: string;
  context: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stack: any;
  statusCode?: number;
  durationMs?: number;
  ip?: string;
}

const pgTransport = new PostgresTransport<MyLogTable>({
  connectionString: envPostgresUrl,
  maxPool: 10,
  level: "info",
  tableName: "Logs",
  tableColumns: [
    { name: "id", dataType: "SERIAL", primaryKey: true },
    { name: "level", dataType: "VARCHAR" },
    { name: "timestamp", dataType: "TIMESTAMP" },
    { name: "message", dataType: "TEXT" },
    { name: "context", dataType: "VARCHAR" },
    { name: "stack", dataType: "JSON" },
    { name: "statusCode", dataType: "INT4" },
    { name: "durationMs", dataType: "INT4" },
    { name: "ip", dataType: "VARCHAR" },
  ],
});

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp, context, stack }) => {
      return JSON.stringify({
        level,
        timestamp,
        context,
        message,
        stack,
      });
    }),
  ),
  transports: [pgTransport, new winston.transports.Console()],
});

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  const userSessionId = req.session?.passport?.user;
  const username = req.user?.username;
  if (MODE === "development") return next();
  if (!userSessionId) return next();

  // Only log the request start
  const logMeta = {
    message: `HTTP ${req.method} ${req.path}`,
    context: username || "anonymous",
    stack: {
      userAgent: req.headers["user-agent"],
    },
    ip: req.ip?.replace("::ffff:", ""),
  };
  /* 
  // Log initial request info
  logger.info(logMeta.message, {
    ...logMeta,
    level: 'info',
  }); */

  // Wait for response to finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    const responseMeta = {
      statusCode: res.statusCode,
      durationMs: duration,
    };

    // Optionally log errors if status >= 400
    if (res.statusCode >= 400) {
      logger.error(`Request completed with status ${res.statusCode}`, {
        ...logMeta,
        ...responseMeta,
        level: "warn",
      });
      return;
    }

    logger.info(`Request completed with status ${res.statusCode}`, {
      ...logMeta,
      ...responseMeta,
      level: "info",
    });
  });

  next();
}
