import { Router } from "express";
import {
  submitLab,
  getClassroomLabSubmissions,
} from "./lab-submission.controller.ts";
import upload from "@srvr/configs/multer.config.ts";
import { checkAuthentication } from "@srvr/middlewares/auth.middleware.ts";

const router = Router();

// POST /api/lab-submissions
router.post("/", checkAuthentication, upload.any(), submitLab);
router.get("/:classroomId", checkAuthentication, getClassroomLabSubmissions);

export default router;
