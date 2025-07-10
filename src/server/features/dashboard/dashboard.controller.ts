import { Request, Response } from "express";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
import {
  getDashboardSummaryMetrics,
  getDashboardOnlineUsersTimeSeries,
} from "./dashboard.service.ts";

export const getDashboardSummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const metrics = await getDashboardSummaryMetrics();
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "dashboard metrics fetched successfully",
      summary: metrics,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      message: APP_RESPONSE_MESSAGE.serverError,
    });
  }
};

export const getDashboardSeries = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const series = await getDashboardOnlineUsersTimeSeries();
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "dashboard series fetched successfully",
      series: series,
    });
  } catch (error) {
    console.error("Error fetching dashboard series:", error);
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      message: APP_RESPONSE_MESSAGE.serverError,
    });
  }
};
