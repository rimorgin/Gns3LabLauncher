import { Prisma } from "@prisma/client";
import { RoleName, RolesCollection } from "@srvr/types/auth.type.ts";
import { getRolePermissions } from "@srvr/utils/db/helpers.ts";
import prisma from "@srvr/utils/db/prisma.ts";

export class MeService {
  /**
   * Fetches the currently authenticated user from the database using their session ID.
   *
   * @param {Request} req - Express request object containing session data.
   * @param {Response} res - Express response object to send back the user data or error message.
   *
   * @returns {Promise<void>} Sends:
   *  - 200 with user and session expiry if found
   *  - 401 if not logged in
   *  - 404 if user is not found in the database
   */
  static async profile(id?: string) {
    // First: Get the user and check the role
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true }, // only what you need for branching
    });

    if (!user) return null;

    // Student path
    if (user.role === "student") {
      const fullStudent = await prisma.user.findUnique({
        where: { id },
        include: {
          student: {
            include: {
              classrooms: {
                include: {
                  course: {
                    select: {
                      courseCode: true,
                      courseName: true,
                    },
                  },
                  projects: {
                    include: {
                      lab: true,
                    },
                  },
                },
              },
              userGroups: true,
              progress: true,
              labProgress: true,
              submissions: true,
            },
          },
        },
        omit: { password: true },
      });

      if (!fullStudent?.student) return fullStudent;

      const studentId = fullStudent.student.userId;
      const allProjects = fullStudent.student.classrooms.flatMap(
        (c) => c.projects,
      );
      const allLabsByProject = allProjects.map((project) => ({
        projectId: project.id,
        labs: project.lab,
      }));

      // --- Step 1: Ensure Progress entries exist ---
      const existingProgresses = await prisma.progress.findMany({
        where: { studentId },
        select: { id: true, projectId: true },
      });

      const existingProgressMap = new Map(
        existingProgresses.map((p) => [p.projectId, p.id]),
      );

      const missingProjects = allProjects.filter(
        (p) => !existingProgressMap.has(p.id),
      );

      if (missingProjects.length > 0) {
        await prisma.progress.createMany({
          data: missingProjects.map((project) => ({
            studentId,
            projectId: project.id,
            percentComplete: 0,
            status: "NOT_STARTED" as const,
          })),
          skipDuplicates: true,
        });
      }

      // --- Step 2: Ensure LabProgress per (progressId, labId) ---
      const updatedProgresses = await prisma.progress.findMany({
        where: { studentId },
        select: { id: true, projectId: true },
      });

      updatedProgresses.forEach((p) => {
        existingProgressMap.set(p.projectId, p.id);
      });

      const existingLabProgresses = await prisma.labProgress.findMany({
        where: { progress: { studentId } },
        select: { labId: true, progressId: true },
      });

      const existingLabProgressKey = new Set(
        existingLabProgresses.map((lp) => `${lp.progressId}:${lp.labId}`),
      );

      const missingLabProgresses: Prisma.LabProgressCreateManyInput[] = [];

      for (const { projectId, labs } of allLabsByProject) {
        const progressId = existingProgressMap.get(projectId);
        if (!progressId) continue;

        for (const lab of labs) {
          const key = `${progressId}:${lab.id}`;
          if (!existingLabProgressKey.has(key)) {
            missingLabProgresses.push({
              progressId,
              labId: lab.id,
              percentComplete: 0,
              status: "NOT_STARTED",
            });
          }
        }
      }

      if (missingLabProgresses.length > 0) {
        await prisma.labProgress.createMany({
          data: missingLabProgresses,
          skipDuplicates: true,
        });
      }

      // Return full profile with progress/labProgress filled
      return prisma.user.findUnique({
        where: { id },
        include: {
          student: {
            include: {
              classrooms: {
                include: {
                  course: {
                    select: {
                      courseCode: true,
                      courseName: true,
                    },
                  },
                  projects: {
                    include: {
                      lab: {
                        select: {
                          id: true,
                          title: true,
                          status: true,
                          description: true,
                        },
                      },
                    },
                  },
                },
              },
              userGroups: true,
              progress: true,
              labProgress: true,
              submissions: true,
            },
          },
        },
      });
    }

    // Instructor or Admin path
    return prisma.user.findUnique({
      where: { id },
      include: {
        instructor: {
          include: {
            classrooms: {
              include: {
                course: {
                  select: {
                    courseCode: true,
                    courseName: true,
                  },
                },
              },
            },
          },
        },
      },
      omit: { password: true },
    });
  }

  static async permissions(roles: RolesCollection, userRole: RoleName) {
    const permissions = getRolePermissions(roles, userRole);
    return permissions;
  }
}
