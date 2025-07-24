import prisma from "@srvr/utils/db/prisma.ts";
import path from "path";
import fs from "fs";

type HandleLabSubmissionInput = {
  studentId: string;
  classroomId: string;
  labId: string;
  projectId: string;
  completedTasks?: string[];
  completedVerifications?: string[];
  completedSections?: number[];
};

export const handleLabSubmission = async (
  props: HandleLabSubmissionInput,
  fileProps: Express.Multer.File[] = [],
) => {
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
      uniqueLabSubmissionPerStudent: {
        labId,
        studentId,
      },
    },
    select: {
      id: true,
      files: true,
    },
  });

  if (existing) {
    for (const file of existing.files) {
      const filePath = path.join(
        process.cwd(),
        "src/server/uploads",
        file.url.split("/uploads/")[1],
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
        url: `/uploads/${file.filename}`,
        name: file.originalname,
      }))
    : [];

  const submission = await prisma.labSubmission.upsert({
    where: {
      uniqueLabSubmissionPerStudent: {
        labId,
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
};
