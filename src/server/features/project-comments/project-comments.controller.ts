// src/controllers/comment.controller.ts
import { NextFunction, Request, Response } from "express";
import ProjectCommentsService from "./project-comments.service.ts";
import { ValidationInputError } from "@srvr/error/validation-input.error.ts";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";

export async function getComments(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      throw new ValidationInputError([projectId]);
    }
    const comments = await ProjectCommentsService.getByProjectId(projectId);
    res.json(comments);
  } catch {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ error: "Failed to fetch comments" });
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { projectId } = req.params;
    const { commentText } = req.body;
    console.log("🚀 ~ createComment ~ commentText:", commentText);

    if (!commentText?.trim()) {
      throw new ValidationInputError(["commentText"]);
    }
    const newComment = await ProjectCommentsService.addComment({
      projectId,
      userId: req.user!.id,
      userName: req.user!.name ?? req.user!.username,
      commentText,
    });

    res.status(HTTP_RESPONSE_CODE.CREATED).json(newComment);
  } catch (error) {
    next(error);
  }
}

export async function createReply(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { projectId, parentId } = req.params;
    const { commentText } = req.body;

    if (!commentText?.trim()) {
      throw new ValidationInputError(["commentText"]);
    }

    const newReply = await ProjectCommentsService.addReply({
      projectId,
      parentId,
      userId: req.user!.id,
      userName: req.user!.name ?? req.user!.username,
      commentText,
    });

    res.status(HTTP_RESPONSE_CODE.CREATED).json(newReply);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { projectId, commentId } = req.params;

    await ProjectCommentsService.deleteComment({
      projectId,
      commentId,
      userId: req.user!.id, // so we can verify ownership
    });

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ message: "Comment Deleted" });
  } catch (error) {
    next(error);
  }
}
