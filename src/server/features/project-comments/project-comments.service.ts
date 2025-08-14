import { ResourceNotFoundError } from "@srvr/error/resource-not-found.error.ts";
import prisma from "@srvr/utils/db/prisma.ts";

export default class ProjectCommentsService {
  static async getByProjectId(projectId: string) {
    return prisma.comment.findMany({
      where: { projectId, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }
  static async addComment({
    projectId,
    userId,
    userName,
    commentText,
  }: {
    projectId: string;
    userId: string;
    userName: string;
    commentText: string;
  }) {
    return prisma.comment.create({
      data: {
        projectId,
        userId,
        userName,
        commentText,
      },
    });
  }
  static async addReply({
    projectId,
    parentId,
    userId,
    userName,
    commentText,
  }: {
    projectId: string;
    parentId: string;
    userId: string;
    userName: string;
    commentText: string;
  }) {
    // Ensure parent exists
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parent) throw new Error("Parent comment not found");

    return prisma.comment.create({
      data: {
        projectId,
        parentId,
        userId,
        userName,
        commentText,
      },
    });
  }

  static async deleteComment({
    commentId,
  }: {
    projectId: string;
    commentId: string;
    userId: string;
  }) {
    // Ensure comment exists & belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new ResourceNotFoundError({ name: "Comment", id: commentId });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return true;
  }
}
