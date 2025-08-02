import { Request, Response } from "express";
import { LabSubmissionService } from "./lab-submission.service.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "@srvr/configs/constants.config.ts";
import { ValidationInputError } from "@srvr/error/validation-input.error.ts";
import { MaxAttemptsReachedError } from "@srvr/error/max-attempt-submission.error.ts";
import { UnauthenticatedRequestError } from "@srvr/error/unauthenticated.error.ts";

export const submitLab = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;
    const {
      labId,
      classroomId,
      projectId,
      completedTasks,
      completedVerifications,
      completedSections,
    } = req.body;
    const files = req.files as Express.Multer.File[];
    console.log("🚀 ~ submitLabController ~ files:", files);

    const missingFields = [];

    if (!labId) missingFields.push("labId");
    if (!projectId) missingFields.push("projectId");
    if (!classroomId) missingFields.push("classroomId");
    if (missingFields.length > 0) {
      throw new ValidationInputError(missingFields);
    }

    const result = await LabSubmissionService.submit(
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

    return res.status(HTTP_RESPONSE_CODE.CREATED).json(result);
  } catch (error) {
    if (error instanceof UnauthenticatedRequestError) {
      return res
        .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
        .json({ error: error.message });
    }

    if (error instanceof ValidationInputError) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ error: error.message });
    }

    if (error instanceof MaxAttemptsReachedError) {
      return res
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ error: error.message });
    }
    return res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ error: APP_RESPONSE_MESSAGE.serverError });
  }
};

export const gradeLab = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const missingFields = [];

    if (!submissionId) missingFields.push("submissionId");
    if (missingFields.length > 0) {
      throw new ValidationInputError(missingFields);
    }

    const result = await LabSubmissionService.gradeById({
      submissionId: submissionId,
      grade,
      feedback,
    });

    return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(result);
  } catch (error) {
    if (error instanceof UnauthenticatedRequestError) {
      return res
        .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
        .json({ error: error.message });
    }

    if (error instanceof ValidationInputError) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ error: error.message });
    }

    return res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ error: APP_RESPONSE_MESSAGE.serverError });
  }
};

export const getClassroomLabSubmissions = async (
  req: Request,
  res: Response,
) => {
  try {
    const { classroomId } = req.params;
    const { studentId } = req.query;

    const missingFields = [];
    if (!classroomId) missingFields.push("classroomId");
    if (missingFields.length > 0) {
      throw new ValidationInputError(missingFields);
    }

    const result = await LabSubmissionService.classroomLabSubmissions({
      classroomId,
      options: {
        studentId: typeof studentId === "string" ? studentId : undefined,
      },
    });

    return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(result);
  } catch (error) {
    if (error instanceof ValidationInputError) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ error: error.message });
    }

    return res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ error: APP_RESPONSE_MESSAGE.serverError });
  }
};
