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

interface Comment {
  id: string;
  userName: string;
  commentText: string;
  timestamp: Date;
}

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      userName: "Alice Johnson",
      commentText:
        "This is a fascinating project! I'm excited to see the progress.",
      timestamp: new Date("2024-07-20T15:00:00Z"),
    },
    {
      id: "2",
      userName: "Bob Smith",
      commentText:
        "Could you elaborate on the quantum algorithm development part?",
      timestamp: new Date("2024-07-20T16:15:00Z"),
    },
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentUserName, setNewCommentUserName] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() && newCommentUserName.trim()) {
      const newComment: Comment = {
        id: String(comments.length + 1),
        userName: newCommentUserName.trim(),
        commentText: newCommentText.trim(),
        timestamp: new Date(),
      };
      setComments([...comments, newComment]);
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
              <div
                key={comment.id}
                className="flex items-start space-x-4 p-4 border rounded-md"
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
                  <p className="text-sm text-foreground mt-1">
                    {comment.commentText}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
