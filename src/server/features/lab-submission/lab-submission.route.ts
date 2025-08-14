import { Router } from "express";
import {
  submitLab,
  getClassroomLabSubmissions,
  gradeLab,
} from "./lab-submission.controller.ts";
import upload from "@srvr/configs/multer.config.ts";
import { checkAuthentication } from "@srvr/middlewares/auth.middleware.ts";

const router = Router();

/**
 * @route   POST /lab-submission
 * @desc    Submits a lab assignment for a student. Accepts file uploads and lab data.
 *          The submission is associated with the authenticated user and a specific lab/classroom.
 * @access  Private (requires user authentication)
 * @middleware checkAuthentication - Ensures the user is logged in.
 * @middleware upload.any() - Handles multipart form data and file uploads.
 * @handler submitLab - Processes and saves the lab submission to the database.
 */
router.post("/", checkAuthentication, upload.any(), submitLab);

/**
 * @route   PATCH /lab-submission/:submissionId
 * @desc    Grades a specific lab submission by updating its grade and feedback.
 *          Only instructors or TAs should be able to update grades.
 * @access  Private (requires authentication and proper authorization)
 * @param   {string} submissionId - The unique ID of the lab submission to grade.
 * @middleware checkAuthentication - Ensures the user is authenticated.
 * @handler gradeLab - Applies the grade and feedback to the specified submission.
 */
router.patch("/:submissionId", checkAuthentication, gradeLab);

/**
 * @route   GET /lab-submission/:classroomId
 * @desc    Retrieves all lab submissions for a given classroom.
 *          Useful for instructors to review all student submissions for a class.
 * @access  Private (requires user authentication)
 * @param   {string} classroomId - The ID of the classroom to fetch submissions for.
 * @middleware checkAuthentication - Ensures the user is logged in.
 * @handler getClassroomLabSubmissions - Fetches and returns submissions linked to the classroom.
 */
router.get("/:classroomId", checkAuthentication, getClassroomLabSubmissions);

export default router;
