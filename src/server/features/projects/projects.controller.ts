import prisma from "@srvr/utils/db/prisma.ts";
import { Request, Response } from "express";
import { createProject } from "./projects.service.ts";


/**
 * Retrieves a list of projects, optionally populated with embedded classroom data.
 *
 * If `embed_data` query parameter is present, it populates related classroom details.
 *
 * @function getProjects
 *
 * @param {Request} req - Express request object, may include `embed_data` query param.
 * @param {Response} res - Express response object to return project data or errors.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 JSON array of projects
 *  - 500 Internal Server Error if fetching fails
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  const { embed_data: requiresEmbeddedData, only_ids, partial } = req.query;
  const projects = requiresEmbeddedData
    ? await prisma.project.findMany({
        include: {
          classroom: true
        },
    })
    : only_ids 
    ? await prisma.project.findMany({
        select: {
          id: true
        }
      })
    : partial 
    ? await prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
        }
      }) 
    : await prisma.project.findMany();
  
  res.status(200).json(projects)
}

/**
 * Creates a new project after checking for uniqueness by name.
 *
 * @function postProjects
 *
 * @param {Request} req - Express request object containing project data in the body.
 * @param {Response} res - Express response object to return success or error messages.
 *
 * @returns {Promise<void>} Sends:
 *  - 201 Created with the new project data
 *  - 409 Conflict if a project with the same name already exists
 *  - 500 Internal Server Error if an exception occurs
 */
export const postProjects = async (req: Request, res: Response): Promise<void> => {
  const { projectName } = req.body;
  const projectExists = await prisma.project.findUnique({ where: { projectName } });
  console.log("🚀 ~ postProjects ~ projectName :", projectName )

  if (projectExists) {
    res.status(409).json({ message: "Project already exists." });
    return;
  }

  try {
    const newProject = await createProject(req.body)
    res.status(201).json({ message: "Project created", newData: newProject });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating Project: ${error.message}` });
  }
};