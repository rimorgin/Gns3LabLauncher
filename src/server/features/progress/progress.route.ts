import { checkAuthentication } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  getProgressByUniqueStudentProjectKey,
  updateProgressById,
} from "./progress.controller.ts";

const router = Router();

router.get(
  "/:projectId/:studentId",
  checkAuthentication,
  getProgressByUniqueStudentProjectKey,
);

router.patch("/:id", checkAuthentication, updateProgressById);

export default router;
