import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  getDashboardSeries,
  getDashboardSummary,
} from "./dashboard.controller.ts";

const router = Router();

/**
 * @route   GET /dashboard
 * @desc    Fetch dashboard metrics like active classrooms, total students, submissions this month, etc.
 * @access  Authenticated users with 'read_dashboard' permission
 */
router.get(
  "/summary",
  checkAuthentication,
  checkPermission(["read_dashboard"]),
  getDashboardSummary,
);

/**
 * @route   GET /dashboard
 * @desc    Fetch dashboard metrics like active classrooms, total students, submissions this month, etc.
 * @access  Authenticated users with 'read_dashboard' permission
 */
router.get(
  "/series",
  checkAuthentication,
  checkPermission(["read_dashboard"]),
  getDashboardSeries,
);

export default router;
