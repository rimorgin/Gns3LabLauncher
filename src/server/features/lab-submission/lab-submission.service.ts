import prisma from "@srvr/utils/db/prisma.ts";
import path from "path";
import fs from "fs";
import { MaxAttemptsReachedError } from "@srvr/error/max-attempt-submission.error.ts";

type HandleLabSubmissionInput = {
  studentId: string;
  classroomId: string;
  labId: string;
  projectId: string;
  completedTasks?: string[];
  completedVerifications?: string[];
  completedSections?: number[];
};
export class LabSubmissionService {
  static async submit(
    props: HandleLabSubmissionInput,
    fileProps: Express.Multer.File[] = [],
  ) {
    const {
      labId,
      studentId,
      classroomId,
      projectId,
      completedTasks = [],
      completedVerifications = [],
      completedSections = [],
    } = props;

    // 1. Clean up existing submission (if any)
    const existing = await prisma.labSubmission.findUnique({
      where: {
        uniqueLabSubmissionPerStudentAndPerProject: {
          labId,
          projectId,
          studentId,
        },
      },
      select: {
        id: true,
        files: true,
        attempt: true,
      },
    });

    if (existing) {
      // CHECK MAX ATTEMPT
      const isMaxAttempt = await prisma.lab.findUnique({
        where: { id: labId },
        select: { settings: true },
      });
      if (isMaxAttempt?.settings?.maxAttemptSubmission === existing.attempt) {
        throw new MaxAttemptsReachedError();
      }
      for (const file of existing.files) {
        const filePath = path.join(
          process.cwd(),
          "src/server/submissions",
          file.url.split("submissions/")[1],
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.labSubmissionFile.deleteMany({
        where: { labSubmissionId: existing.id },
      });
    }

    // 2. Upload new files (if any)
    const fileData = fileProps.length
      ? fileProps.map((file) => ({
          url: `/submissions/${file.filename}`,
          name: file.originalname,
        }))
      : [];

    const submission = await prisma.labSubmission.upsert({
      where: {
        uniqueLabSubmissionPerStudentAndPerProject: {
          labId,
          projectId,
          studentId,
        },
      },
      update: {
        attempt: { increment: 1 },
        submittedAt: new Date(),
        ...(fileData.length && {
          files: { create: fileData },
        }),
      },
      create: {
        labId,
        studentId,
        projectId,
        status: "pending",
        attempt: 1,
        submittedAt: new Date(),
        ...(fileData.length && {
          files: { create: fileData },
        }),
      },
      include: {
        files: true,
      },
    });

    // 3. Ensure Progress exists
    const progress = await prisma.progress.upsert({
      where: {
        uniqueStudentProjectProgress: {
          studentId,
          projectId,
        },
      },
      update: {}, // do nothing if already exists
      create: {
        studentId,
        projectId,
        classroomId,
      },
      select: {
        id: true,
      },
    });

    // 4. Upsert LabProgress to mark lab as completed
    await prisma.labProgress.upsert({
      where: {
        uniqueProgressPerLab: {
          progressId: progress.id,
          labId,
        },
      },
      update: {
        status: "COMPLETED",
        percentComplete: 100,
        completedAt: new Date(),
      },
      create: {
        progressId: progress.id,
        labId,
        studentId,
        completedSections,
        completedTasks,
        completedVerifications,
        status: "COMPLETED",
        percentComplete: 100,
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    return submission;
  }
  static async classroomLabSubmissions(props: {
    classroomId: string;
    options?: { studentId?: string };
  }) {
    const { classroomId, options } = props;

    const linkedProjects = await prisma.project.findMany({
      where: {
        classrooms: {
          some: { id: classroomId },
        },
      },
      select: { id: true },
    });

    const projectIds = linkedProjects.map((p) => p.id);

    const classroomLabSubmissions = await prisma.labSubmission.findMany({
      where: {
        projectId: { in: projectIds },
        ...(options?.studentId ? { studentId: options.studentId } : {}),
      },
      include: {
        lab: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        project: {
          select: {
            id: true,
            projectName: true,
            projectDescription: true,
          },
        },
        files: true,
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    const classroomLabs = await prisma.lab.findMany({
      where: {
        project: {
          some: {
            id: { in: projectIds },
          },
        },
      },
      include: {
        environment: {
          include: {
            topology: {
              include: {
                links: true,
                nodes: { include: { interfaces: true } },
                notes: true,
              },
            },
          },
        },
        guide: {
          include: {
            sections: {
              include: {
                content: {
                  include: {
                    metadata: true,
                  },
                },
                tasks: true,
                verifications: true,
              },
            },
          },
        },
        settings: true,
      },
    });

    return {
      submissions: classroomLabSubmissions,
      labs: classroomLabs,
    };
  }
}
