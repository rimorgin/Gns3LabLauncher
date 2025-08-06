// src/features/cron/cron.controller.ts
import { Request, Response } from "express";
import { CronService } from "./cron.service.ts";
import { CronKeyNotFound } from "@srvr/error/cron-key-not-found.error.ts";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";

export const CronController = {
  async list(req: Request, res: Response) {
    const jobs = await CronService.getAll();
    res.json(jobs);
  },

  async toggle(req: Request, res: Response) {
    const { key } = req.params;
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ error: "`enabled` must be a boolean" });
    }

    try {
      const job = await CronService.updateEnabled(key, enabled);
      res.json(job);
    } catch (error) {
      if (error instanceof CronKeyNotFound)
        res
          .status(HTTP_RESPONSE_CODE.NOT_FOUND)
          .json({ error: `Cron job with key '${key}' not found.` });
    }
  },

  async update(req: Request, res: Response) {
    const { key } = req.params;
    const { name, schedule } = req.body;

    try {
      const updated = await CronService.updateJob(key, { name, schedule });
      res.json(updated);
    } catch (error) {
      if (error instanceof CronKeyNotFound)
        res
          .status(HTTP_RESPONSE_CODE.NOT_FOUND)
          .json({ error: `Cron job with key '${key}' not found.` });
    }
  },
};
