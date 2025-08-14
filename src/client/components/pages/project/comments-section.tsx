"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { Button } from "@clnt/components/ui/button";
import { Textarea } from "@clnt/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { cn } from "@clnt/lib/utils";
import { MessageSquare, Trash2 } from "lucide-react";
import { useProjectCommentsQuery } from "@clnt/lib/queries/project-comments-query";
import { useProjectCommentsAddComment } from "@clnt/lib/mutations/project-comments/add-comment-mutation";
import { useProjectCommentsAddReply } from "@clnt/lib/mutations/project-comments/add-reply-mutation";
import { useProjectCommentsDeleteComment } from "@clnt/lib/mutations/project-comments/delete-comment-mutation";
import { useUser } from "@clnt/lib/auth";

export interface ProjectComment {
  id: string;
  userName: string;
  commentText: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
  userId: string;
  replies?: ProjectComment[];
}

interface ProjectCommentItemProps {
  projectId: string;
  comment: ProjectComment;
  onAddReply: (parentId: string, commentText: string) => void;
  depth?: number;
}

const CommentItem: React.FC<ProjectCommentItemProps> = ({
  projectId,
  comment,
  onAddReply,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const user = useUser();
  const deleteComment = useProjectCommentsDeleteComment(projectId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment.mutate({ commentId: comment.id });
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onAddReply(comment.id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  // Limit indentation to a max of ml-16 for aesthetics
  const indentationClass =
    depth > 0 ? `ml-${Math.min(depth * 4, 16)} border-l pl-4` : "";

  // Delete permission logic
  const canDelete =
    (user.data?.role === "student" && user.data?.id === comment.userId) ||
    user.data?.role === "administrator" ||
    user.data?.role === "instructor";

  return (
    <div
      className={cn(
        "flex items-start space-x-4 p-4 pr-0 rounded-md",
        indentationClass,
      )}
    >
      {/* Avatar */}
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
          alt={comment.userName}
        />
        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{comment.userName}</p>
          <div className="flex items-center gap-5">
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                title="Delete comment"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm mt-1">{comment.commentText}</p>

        {/* Reply Button */}
        <Button
          variant={showReplyForm ? "destructive" : "ghost"}
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="mt-2 text-xs"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          {showReplyForm ? "Discard Reply" : "Reply"}
        </Button>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-4 space-y-2">
            <Textarea
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              required
              className="text-sm"
            />
            <Button type="submit" size="sm">
              Post Reply
            </Button>
          </form>
        )}

        {/* Recursive Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                projectId={projectId}
                comment={reply}
                onAddReply={onAddReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CommentsSection({ projectId }: { projectId: string }) {
  const { data: comments = [], isLoading } = useProjectCommentsQuery(projectId);
  const addComment = useProjectCommentsAddComment(projectId);
  const addReply = useProjectCommentsAddReply(projectId);

  const [newCommentText, setNewCommentText] = useState("");

  if (isLoading) return <p>Loading comments...</p>;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    addComment.mutate(
      { commentText: newCommentText.trim() },
      {
        onSuccess: () => setNewCommentText(""),
      },
    );
  };

  const handleAddReply = (parentId: string, commentText: string) => {
    addReply.mutate({ parentId, commentText });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Discussions & Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Write your comment here..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={4}
            required
          />
          <Button
            type="submit"
            className="w-full"
            disabled={addComment.isPending}
          >
            {addComment.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                projectId={projectId}
                comment={comment}
                onAddReply={handleAddReply}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
