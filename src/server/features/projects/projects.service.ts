import { Prisma, ProjectTagsEnum } from "@prisma/client";
import { IProject } from "@srvr/types/models.type.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import { getRandomImageUrlImage } from "@srvr/utils/random-image-url.utils.ts";
import uuidv4 from "@srvr/utils/uuidv4.utils.ts";

/**
 * Service class to manage Projects.
 *
 * All methods are static — no instantiation required.
 */
export class ProjectService {
  /**
   * Retrieves a list of projects, optionally including classroom and submission data.
   */
  static async getAll(options: {
    classrooms?: boolean;
    submissions?: boolean;
    only_ids?: boolean;
    partial?: boolean;
  }) {
    const { classrooms, submissions, only_ids, partial } = options;

    const includeOptions: Prisma.ProjectSelect | undefined = {
      classrooms: classrooms
        ? {
            select: {
              id: true,
              classroomName: true,
              course: {
                select: {
                  courseCode: true,
                  courseName: true,
                },
              },
            },
          }
        : false,
      submissions: submissions
        ? {
            select: {
              id: true,
              student: true,
              group: true,
              grade: true,
              feedback: true,
              files: true,
            },
          }
        : false,
    };

    const projects = only_ids
      ? await prisma.project.findMany({
          select: {
            id: true,
            ...includeOptions,
          },
        })
      : partial
        ? await prisma.project.findMany({
            select: {
              id: true,
              projectName: true,
              ...includeOptions,
            },
          })
        : await prisma.project.findMany({
            select: {
              projectName: true,
              duration: true,
              id: true,
              visible: true,
              tags: true,
              createdAt: true,
              updatedAt: true,
              imageUrl: true,
              ...includeOptions,
            },
          });

    return projects;
  }

  /**
   * Retrieves a single project by ID, optionally including counts and partial data.
   */
  static async getById(
    id: string,
    options: { partial?: boolean; studentsCount?: boolean; labs: boolean },
  ) {
    const { partial, studentsCount, labs } = options;

    const include: Prisma.ProjectInclude = {};
    if (studentsCount) {
      include.classrooms = {
        select: {
          _count: {
            select: {
              students: true,
            },
          },
        },
      };
    }
    if (labs) {
      include.lab = true;
    }

    const where = { where: { id } };

    const project = partial
      ? await prisma.project.findUnique({
          ...where,
          select: {
            id: true,
            projectName: true,
          },
        })
      : await prisma.project.findUnique({
          ...where,
          include,
        });

    return project;
  }
  /**
   * Creates a new project linked to specific classrooms.
   *
   * @param {IProject} props - The project properties used to create the new project.
   * @param {string} props.projectName - The name of the project.
   * @param {string} props.projectDescription - A brief description of the project.
   * @param {string[]} props.classroomIds - The IDs of the classrooms this project is associated with.
   * @param {boolean} props.visible - Whether the project should be visible to students.
   * @param {string} props.imageUrl - URL path of the image; must always be included in the payload.
   * @param {Enum<"networking" | "cyberscurity">} props.tags - Should be either `networking` or `cybersecurity`.
   *
   * @returns {Promise<IProject>} A promise that resolves to the newly created project instance.
   *
   * @throws {Error} If creating the project or its progress records fails.
   */
  static async create(props: IProject): Promise<IProject> {
    const projectId = await uuidv4();
    const imageUrl = getRandomImageUrlImage(
      "projects",
      props?.tags ?? "networking",
    );
    const project = await prisma.project.create({
      data: {
        id: projectId,
        projectName: props.projectName,
        projectDescription: props.projectDescription,
        visible: props.visible,
        duration: props.duration,
        byGroupSubmissions: props.byGroupSubmissions,
        tags: props.tags as ProjectTagsEnum | null,
        imageUrl: imageUrl,
        classrooms: {
          connect: (props.classroomIds ?? []).map((id) => ({ id })),
        },
        submissions: {
          create: {
            status: "idle",
          },
        },
        labId: props.labId,
      },
    });

    // Fetch students & groups in the associated classrooms
    const classroomStudentsOrGroups = await prisma.classroom.findMany({
      where: {
        id: { in: props.classroomIds ?? [] },
      },
      select: {
        id: true,
        ...(props.byGroupSubmissions
          ? { studentGroups: { select: { id: true } } }
          : { students: { select: { userId: true } } }),
      },
    });

    try {
      const progressRecords: Prisma.ProgressCreateManyInput[] = [];

      for (const classroom of classroomStudentsOrGroups) {
        const classroomId = classroom.id;

        if (props.byGroupSubmissions) {
          const groups = (
            classroom as typeof classroom & { studentGroups: { id: string }[] }
          ).studentGroups;

          for (const group of groups) {
            progressRecords.push({
              projectId,
              classroomId,
              groupId: group.id,
              percentComplete: 0,
              status: "NOT_STARTED",
            });
          }
        } else {
          const students = (
            classroom as typeof classroom & { students: { userId: string }[] }
          ).students;

          for (const student of students) {
            progressRecords.push({
              projectId,
              classroomId,
              studentId: student.userId,
              percentComplete: 0,
              status: "NOT_STARTED",
            });
          }
        }
      }

      if (progressRecords.length) {
        await prisma.progress.createMany({ data: progressRecords });
      }
    } catch {
      await prisma.project.delete({ where: { id: projectId } });
      throw new Error("Failed to create project progress records");
    }

    return project;
  }

  /**
   * Updates an existing project with the provided details.
   *
   * @param {string} id - The ID of the project to update.
   * @param {Partial<IProject>} updates - The updates to apply to the project.
   * @returns {Promise<Partial<IProject>>} A promise that resolves to the updated project instance.
   *
   * @throws {Prisma.PrismaClientKnownRequestError} If the project does not exist.
   */
  static async updateById(
    id: string,
    updates: Partial<IProject>,
  ): Promise<Partial<IProject>> {
    const { classroomIds, byGroupSubmissions, ...rest } = updates as IProject;

    const data: Prisma.ProjectUpdateInput = {
      ...rest,
    };

    if (classroomIds) {
      data.classrooms = {
        connect: classroomIds.map((classroomId: string) => ({
          id: classroomId,
        })),
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });

    // handle progress record creation
    if (classroomIds) {
      const classrooms = await prisma.classroom.findMany({
        where: { id: { in: classroomIds } },
        select: {
          id: true,
          ...(byGroupSubmissions
            ? { studentGroups: { select: { id: true } } }
            : { students: { select: { userId: true } } }),
        },
      });

      const progressRecords: Prisma.ProgressCreateManyInput[] = [];

      for (const classroom of classrooms) {
        const classroomId = classroom.id;

        if (byGroupSubmissions) {
          if ("studentGroups" in classroom) {
            const groups = (classroom as { studentGroups: { id: string }[] })
              .studentGroups;

            for (const group of groups) {
              const existing = await prisma.progress.findFirst({
                where: {
                  projectId: id,
                  classroomId,
                  groupId: group.id,
                },
                select: { id: true },
              });

              if (!existing) {
                progressRecords.push({
                  projectId: id,
                  classroomId,
                  groupId: group.id,
                  percentComplete: 0,
                  status: "NOT_STARTED",
                });
              }
            }
          }
        } else {
          if ("students" in classroom) {
            const students = (classroom as { students: { userId: string }[] })
              .students;

            for (const student of students) {
              const existing = await prisma.progress.findFirst({
                where: {
                  projectId: id,
                  classroomId,
                  studentId: student.userId,
                },
                select: { id: true },
              });

              if (!existing) {
                progressRecords.push({
                  projectId: id,
                  classroomId,
                  studentId: student.userId,
                  percentComplete: 0,
                  status: "NOT_STARTED",
                });
              }
            }
          }
        }
      }

      if (progressRecords.length) {
        await prisma.progress.createMany({
          data: progressRecords,
          skipDuplicates: true,
        });
      }
    }

    return updatedProject;
  }

  /**
   * Deletes a project by its ID.
   *
   * @param {string} id - The ID of the project to delete.
   * @returns {Promise<{ projectName: string }>} A promise that resolves to the deleted project's name.
   *
   * @throws {Prisma.PrismaClientKnownRequestError} If the project does not exist.
   */
  static async deleteById(id: string): Promise<{ projectName: string }> {
    const deletedProject = await prisma.project.delete({
      where: { id },
      select: {
        projectName: true,
      },
    });
    return deletedProject;
  }

  /**
   * Deletes many projects by their IDs.
   *
   * @param {string[]} ids - The IDs of the projects to delete.
   * @returns {Promise<{ projectName: string }[]>} A promise that resolves to the deleted project names.
   *
   * @throws {Prisma.PrismaClientKnownRequestError} If any of the projects do not exist.
   */
  static async deleteManyById(
    ids: string[],
  ): Promise<{ projectName: string }[]> {
    const deletedProjects = await prisma.$transaction(
      ids.map((id) =>
        prisma.project.delete({
          where: { id },
          select: { projectName: true }, // Select only needed fields
        }),
      ),
    );
    return deletedProjects;
  }
}
