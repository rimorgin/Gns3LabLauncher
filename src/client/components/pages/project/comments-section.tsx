"use client";

import type React from "react";

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
import { Input } from "@clnt/components/ui/input";
import { cn } from "@clnt/lib/utils";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  userName: string;
  commentText: string;
  timestamp: Date;
  replies?: Comment[]; // Nested replies
}

interface CommentItemProps {
  comment: Comment;
  onAddReply: (parentId: string, userName: string, commentText: string) => void;
  depth?: number; // To control indentation for replies
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onAddReply,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyUserName, setReplyUserName] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && replyUserName.trim()) {
      onAddReply(comment.id, replyUserName.trim(), replyText.trim());
      setReplyText("");
      setReplyUserName("");
      setShowReplyForm(false); // Hide form after submission
    }
  };

  const indentationClass =
    depth > 0 ? `ml-${Math.min(depth * 4, 16)} border-l pl-4` : ""; // Max indentation 16 (4*4)

  return (
    <div
      className={cn(
        "flex items-start space-x-4 p-4 rounded-md",
        indentationClass,
      )}
    >
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
          alt={comment.userName}
        />
        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{comment.userName}</p>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.timestamp).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-foreground mt-1">{comment.commentText}</p>
        <Button
          variant={showReplyForm ? "destructive" : "ghost"}
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="h-3 w-3 mr-1" />{" "}
          {showReplyForm ? "Discard Reply" : "Reply"}
        </Button>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-4 space-y-2">
            <Input
              placeholder="Your Name"
              value={replyUserName}
              onChange={(e) => setReplyUserName(e.target.value)}
              required
              aria-label="Your Name for reply"
              className="text-sm"
            />
            <Textarea
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              required
              aria-label="Your reply"
              className="text-sm"
            />
            <Button type="submit" size="sm">
              Post Reply
            </Button>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
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

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      userName: "Alice Johnson",
      commentText:
        "This is a fascinating project! I'm excited to see the progress.",
      timestamp: new Date("2024-07-20T15:00:00Z"),
      replies: [
        {
          id: "1-1",
          userName: "Charlie Brown",
          commentText:
            "I agree, the quantum computing aspect is particularly intriguing.",
          timestamp: new Date("2024-07-20T15:30:00Z"),
        },
      ],
    },
    {
      id: "2",
      userName: "Bob Smith",
      commentText:
        "Could you elaborate on the quantum algorithm development part?",
      timestamp: new Date("2024-07-20T16:15:00Z"),
      replies: [
        {
          id: "2-1",
          userName: "Alice Johnson",
          commentText:
            "We're focusing on Shor's algorithm and Grover's algorithm for now.",
          timestamp: new Date("2024-07-20T16:30:00Z"),
          replies: [
            {
              id: "2-1-1",
              userName: "Bob Smith",
              commentText: "That's great! Looking forward to updates.",
              timestamp: new Date("2024-07-20T16:45:00Z"),
            },
          ],
        },
      ],
    },
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentUserName, setNewCommentUserName] = useState("");

  const addComment = (userName: string, commentText: string) => {
    const newComment: Comment = {
      id: String(Date.now()), // Unique ID for new comments
      userName: userName,
      commentText: commentText,
      timestamp: new Date(),
      replies: [],
    };
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const addReply = (
    parentId: string,
    userName: string,
    commentText: string,
  ) => {
    const updateComments = (commentsArray: Comment[]): Comment[] => {
      return commentsArray.map((comment) => {
        if (comment.id === parentId) {
          const newReply: Comment = {
            id: `${parentId}-${Date.now()}`, // Unique ID for replies
            userName: userName,
            commentText: commentText,
            timestamp: new Date(),
            replies: [],
          };
          return {
            ...comment,
            replies: comment.replies
              ? [...comment.replies, newReply]
              : [newReply],
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateComments(comment.replies),
          };
        }
        return comment;
      });
    };
    setComments(updateComments);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() && newCommentUserName.trim()) {
      addComment(newCommentUserName.trim(), newCommentText.trim());
      setNewCommentText("");
      setNewCommentUserName("");
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Discussions & Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Submission Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Input
            placeholder="Your Name"
            value={newCommentUserName}
            onChange={(e) => setNewCommentUserName(e.target.value)}
            required
            aria-label="Your Name"
          />
          <Textarea
            placeholder="Write your comment here..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={4}
            required
            aria-label="Your Comment"
          />
          <Button type="submit" className="w-full">
            Post Comment
          </Button>
        </form>

        {/* Existing Comments */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onAddReply={addReply}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
