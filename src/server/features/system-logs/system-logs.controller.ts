import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";
import { Request, Response } from "express";
import { LogsService } from "./system-logs.service.ts";

export async function GetLogs(req: Request, res: Response): Promise<void> {
  const logs = await LogsService.get();
  res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
    message: "Fetched logs",
    logs,
  });
}
