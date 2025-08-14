// src/routes/comment.routes.ts
import { Router } from "express";
import {
  createComment,
  createReply,
  deleteComment,
  getComments,
} from "./project-comments.controller.ts";
import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";

const router = Router();

/**
 * @route   GET /project-comments/:projectId
 * @desc    Retrieves all top-level comments for a specific project.
 *          Does not include replies; replies are nested under comments if needed
 *          or fetched separately depending on controller logic.
 * @access  Public or Private (depending on business logic — currently requires auth)
 * @param   {string} projectId - The ID of the project to fetch comments for.
 * @middleware checkAuthentication - Ensures the user is authenticated (if access should be restricted).
 * @handler getComments - Fetches and returns all comments associated with the project.
 */
router.get("/:projectId", checkAuthentication, getComments);

/**
 * @route   POST /project-comments/:projectId/comments
 * @desc    Creates a new top-level comment on a project.
 *          The comment is authored by the authenticated user.
 * @access  Private (users must be logged in and have 'create_comments' permission)
 * @param   {string} projectId - The ID of the project being commented on.
 * @middleware checkAuthentication - Ensures the user is authenticated.
 * @middleware checkPermission(["create_comments"]) - Ensures the user has the required role/permission.
 * @handler createComment - Processes and saves the new comment to the database.
 */
router.post(
  "/:projectId/comments",
  checkAuthentication,
  checkPermission(["create_comments"]),
  createComment,
);

/**
 * @route   POST /project-comments/:projectId/comments/:parentId/replies
 * @desc    Creates a reply to an existing comment (or reply) identified by `parentId`.
 *          Used for nested discussions within a project's comment thread.
 * @access  Private (users must be authenticated and have 'create_comments' permission)
 * @param   {string} projectId - The ID of the project where the comment resides.
 * @param   {string} parentId - The ID of the comment (or reply) being replied to.
 * @middleware checkAuthentication - Ensures the user is logged in.
 * @middleware checkPermission(["create_comments"]) - Ensures the user can create comments/replies.
 * @handler createReply - Creates and saves the reply under the specified parent comment.
 */
router.post(
  "/:projectId/comments/:parentId/replies",
  checkAuthentication,
  checkPermission(["create_comments"]),
  createReply,
);

router.delete(
  "/:projectId/comments/:commentId",
  checkAuthentication,
  checkPermission(["delete_comments"]),
  deleteComment,
);

export default router;
