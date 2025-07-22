import { LabProgress, Progress, ProgressStatus } from "@prisma/client";
import prisma from "@srvr/utils/db/prisma.ts";

/**
 * Service class for managing student project progress records.
 */
export class ProgressService {
  static async getMyProgress(params: {
    studentId: string;
  }): Promise<{ progress: Progress[]; labProgress: LabProgress[] } | null> {
    const { studentId } = params;
    const progress = await prisma.progress.findMany({
      where: { studentId: { equals: studentId }, groupId: null },
    });
    const labProgress = await prisma.labProgress.findMany({
      where: { studentId: { equals: studentId }, groupId: null },
    });
    return { progress, labProgress };
  }
  /**
   * Retrieves a unique progress record for a given student & project pair.
   *
   * Requires that the `Progress` table has a unique constraint defined on
   * `{ studentId, projectId }` (often named `uniqueStudentProjectProgress`).
   *
   * @param {Object} params - The query parameters.
   * @param {string} params.studentId - The student's user ID.
   * @param {string} params.projectId - The project ID.
   *
   * @returns {Promise<Partial<Progress> | null>} The progress record, or null if not found.
   */
  static async getByUniqueStudentProjectKey(params: {
    studentId: string;
    projectId: string;
  }): Promise<Partial<Progress> | null> {
    const { studentId, projectId } = params;

    return prisma.progress.findUnique({
      where: {
        uniqueStudentProjectProgress: {
          studentId,
          projectId,
        },
      },
    });
  }

  /**
   * Updates a progress record by its ID.
   *
   * @param {Object} props - The properties for the update.
   * @param {string} props.id - The progress record ID.
   * @param {number} props.percentComplete - The updated percent complete.
   * @param {ProgressStatus} props.status - The updated progress status.
   *
   * @returns {Promise<Progress | null>} The updated progress record.
   */
  static async updateById(props: {
    id: string;
    percentComplete: number;
    status: ProgressStatus;
  }): Promise<Progress | null> {
    const { id, percentComplete, status } = props;

    return prisma.progress.update({
      where: { id },
      data: {
        percentComplete,
        status,
      },
    });
  }
}
