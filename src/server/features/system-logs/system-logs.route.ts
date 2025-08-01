import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { GetLogs } from "./system-logs.controller.ts";

const router = Router();

router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_system_logs"]),
  GetLogs,
);
export default router;
