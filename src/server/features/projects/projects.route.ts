import { checkAuthentication, checkPermission } from "@srvr/middlewares/auth.middleware.ts";
import { Router } from "express";
import { getProjects, postProjects } from "./projects.controller.ts";

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

export default router;