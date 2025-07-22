import type { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";

const execAsync = promisify(exec);

export const getDockerStats = async (req: Request, res: Response) => {
  try {
    // Add filters here if needed!
    const { stdout } = await execAsync(
      `docker stats --no-stream --format "{{json .}}"`,
    );

    const stats = stdout
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));

    res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ message: "stats pulled", stats });
  } catch (err) {
    console.error("Error getting docker stats", err);
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ success: false, message: "Failed to get docker stats" });
  }
};
