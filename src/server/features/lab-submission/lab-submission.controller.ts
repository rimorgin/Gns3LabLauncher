import { Request, Response } from "express";
import { handleLabSubmission } from "./lab-submission.service.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";

export const submitLabController = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    const {
      labId,
      classroomId,
      projectId,
      completedTasks,
      completedVerifications,
      completedSections,
    } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!labId || !studentId || !classroomId || !projectId) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ error: "Missing required fields" });
    }

    const result = await handleLabSubmission(
      {
        studentId,
        classroomId,
        labId,
        projectId,
        completedTasks: JSON.parse(completedTasks ?? "[]"),
        completedVerifications: JSON.parse(completedVerifications ?? "[]"),
        completedSections: JSON.parse(completedSections ?? "[]"),
      },
      files,
    );

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: APP_RESPONSE_MESSAGE.serverError });
  }
};
