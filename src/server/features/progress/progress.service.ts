import { Progress, ProgressStatus } from "@prisma/client";
import prisma from "@srvr/utils/db/prisma.ts";

export const getProgressByUniqueStudentProjectKey = async ({
  studentId,
  projectId,
}: {
  studentId: string;
  projectId: string;
}): Promise<Partial<Progress | null>> => {
  const progress = await prisma.progress.findUnique({
    where: {
      uniqueStudentProjectProgress: {
        studentId: studentId,
        projectId: projectId,
      },
    },
  });
  return progress;
};

export const updateProgressById = async (props: {
  id: string;
  percentComplete: number;
  status: ProgressStatus;
}): Promise<Progress | null> => {
  return prisma.progress.update({
    where: { id: props.id },
    data: {
      percentComplete: props.percentComplete,
      status: props.status,
    },
  });
};
