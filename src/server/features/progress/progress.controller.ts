import { Request, Response } from "express";
import * as progressService from "./progress.service.ts";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";

/**
 * Retrieves progress for a specific student in a project.
 *
 * @function getProgressByUniqueStudentProjectKey
 * @param {Request} req - Express request object containing projectId and studentId in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with progress data if found
 *  - 400 Bad Request if projectId or studentId is missing
 *  - 404 Not Found if progress is not found
 */
export const getProgressByUniqueStudentProjectKey = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectId, studentId } = req.params;

  if (!projectId || !studentId) {
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ message: "projectId and studentId are required." });
    return;
  }

  /* if (status) {
    const enumValues = Object.values(ProgressStatus);
    const validateStatus = enumValues.includes(status as ProgressStatus);

    if (!validateStatus) {
      res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: `Status ${status} is not allowed.` });
      return;
    }
  } */

  const progress = await progressService.getProgressByUniqueStudentProjectKey({
    projectId,
    studentId,
  });

  if (!progress) {
    res
      .status(HTTP_RESPONSE_CODE.NOT_FOUND)
      .json({ message: "Progress not found." });
    return;
  }

  res
    .status(HTTP_RESPONSE_CODE.SUCCESS)
    .json({ message: "progress return", progress: progress });
  return;
};

/**
 * Updates progress by ID.
 *
 * @function updateProgressById
 * @param {Request} req - Express request object containing progress data in the body.
 * @param {Response} res - Express response object to return success or error messages.
 * @returns {Promise<void>} Sends:
 *  - 200 JSON with updated progress if successful
 *  - 400 Bad Request if id, percent, or status is missing
 *  - 404 Not Found if progress with the given ID does not exist
 */
export const updateProgressById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { percentComplete, status } = req.body;

  if (!id || !status) {
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ message: "id, status are required." });
    return;
  }

  const updatedProgress = await progressService.updateProgressById({
    id,
    percentComplete,
    status,
  });

  if (!updatedProgress) {
    res
      .status(HTTP_RESPONSE_CODE.NOT_FOUND)
      .json({ message: "Progress not found." });
    return;
  }

  res
    .status(HTTP_RESPONSE_CODE.SUCCESS)
    .json({ message: "progress updated", progress: updatedProgress });
};
