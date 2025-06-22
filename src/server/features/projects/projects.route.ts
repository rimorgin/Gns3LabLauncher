import { checkAuthentication, checkPermission } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { deleteProject, getProjects, getProjectsById, patchProject, postProjects } from "./projects.controller.ts";

const router = Router()

/**
 * @route   GET /projects
 * @desc    Fetch list of all projects, optionally populated with classroom info.
 * @access  Authenticated users with 'read_projects' permission
 */
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_projects"]),
  getProjects
);

/**
 * @route   GET /projects/:id
 * @desc    Fetch list of all projects, optionally populated with classroom info.
 * @access  Authenticated users with 'read_projects' permission
 */
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_projects"]),
  getProjectsById
);

/**
 * @route   POST /projects
 * @desc    Create a new project.
 * @access  Authenticated users with 'create_projects' permission
 */
router.post(
  "/",
  checkAuthentication,
  checkPermission(["create_projects"]),
  postProjects
);

/**
 * @route   GET /projects/:id
 * @desc    Fetch list of all projects, optionally populated with classroom info.
 * @access  Authenticated users with 'read_projects' permission
 */
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_projects"]),
  getProjectsById
);

/**
 * @route   PATCH /projects/:id
 * @desc    Updates a project.
 * @access  Authenticated users with 'update_projects' permission
 */
router.patch(
  "/:id",
  checkAuthentication,
  checkPermission(["read_projects"]),
  patchProject
);

/**
 * @route   DELETE /projects/:id
 * @desc    Delete a project.
 * @access  Authenticated users with 'delete_projects' permission
 */
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["read_projects"]),
  deleteProject
);

export default router;