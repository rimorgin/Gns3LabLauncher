import { Router } from "express";
import { submitLabController } from "./lab-submission.controller.ts";
import upload from "@srvr/configs/multer.config.ts";

const router = Router();

// POST /api/lab-submissions
router.post("/", upload.any(), submitLabController);

export default router;
