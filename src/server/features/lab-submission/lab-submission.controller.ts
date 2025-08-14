import { NextFunction, Request, Response } from "express";
import { LabSubmissionService } from "./lab-submission.service.ts";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";
import { ValidationInputError } from "@srvr/error/validation-input.error.ts";

export const submitLab = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    return next(error);
  }
};

export const gradeLab = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

export const getClassroomLabSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
    return next(error);
  }
};
