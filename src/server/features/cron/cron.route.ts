import { Router } from "express";
import { CronController } from "./cron.controller.ts";
import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";

const router = Router();

router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_cron-jobs"]),
  CronController.list,
);
router.patch(
  "/:key/toggle",
  checkAuthentication,
  checkPermission(["update_cron-jobs"]),
  CronController.toggle,
);
router.patch(
  "/:key",
  checkAuthentication,
  checkPermission(["update_cron-jobs"]),
  CronController.update,
);

export default router;
