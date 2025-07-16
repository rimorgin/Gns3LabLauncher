"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Textarea } from "@clnt/components/ui/textarea";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Badge } from "@clnt/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Separator } from "@clnt/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { FileText, Download, MessageSquare, Calendar } from "lucide-react";
import type { Submission } from "@clnt/types/project";

interface GradingInterfaceProps {
  submissions: Submission[];
  onGradeSubmission: (
    submissionId: string,
    score: number,
    feedback: string,
  ) => void;
  onClose: () => void;
}

interface SubmissionWithUser extends Submission {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  project: {
    id: string;
    name: string;
  };
}

export function GradingInterface({
  submissions,
  onGradeSubmission,
  onClose,
}: GradingInterfaceProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionWithUser | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGrading, setIsGrading] = useState(false);

  // Mock data enhancement - in real app, this would come from API
  const submissionsWithUsers: SubmissionWithUser[] = submissions.map((sub) => ({
    ...sub,
    user: {
      id: `user_${Math.random()}`,
      name: `Student ${Math.floor(Math.random() * 100)}`,
      email: `student${Math.floor(Math.random() * 100)}@example.com`,
      avatar: `/placeholder.svg?height=32&width=32`,
    },
    project: {
      id: sub.projectId,
      name: "GNS3 Network Simulation Lab",
    },
  }));

  const handleSubmissionSelect = (submission: SubmissionWithUser) => {
    setSelectedSubmission(submission);
    setScore(submission.score?.toString() || "");
    setFeedback(submission.feedback || "");
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;

    setIsGrading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onGradeSubmission(
        selectedSubmission.id,
        Number.parseInt(score),
        feedback,
      );
      setSelectedSubmission(null);
      setScore("");
      setFeedback("");
    } catch (error) {
      console.error("Failed to submit grade:", error);
    } finally {
      setIsGrading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      REVIEWED: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors];
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const pendingSubmissions = submissionsWithUsers.filter(
    (s) => s.status === "SUBMITTED",
  );
  const reviewedSubmissions = submissionsWithUsers.filter(
    (s) => s.status === "REVIEWED",
  );

  return (
    <div className="h-screen flex">
      {/* Submissions List */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lab Submissions</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>{pendingSubmissions.length} pending</span>
            <span>{reviewedSubmissions.length} reviewed</span>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="pending">
              Pending ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({reviewedSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            <div className="space-y-2 p-4">
              {pendingSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedSubmission?.id === submission.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => handleSubmissionSelect(submission)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={submission.user.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {submission.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {submission.user.name}
                          </p>
                          <Badge
                            className={`${getStatusColor(submission.status)} w-sm`}
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {submission.project.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            submission.submittedAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviewed" className="mt-0">
            <div className="space-y-2 p-4">
              {reviewedSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedSubmission?.id === submission.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => handleSubmissionSelect(submission)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={submission.user.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {submission.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {submission.user.name}
                          </p>
                          <Badge
                            className={`${getStatusColor(submission.status)} w-sm`}
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {submission.project.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              submission.submittedAt,
                            ).toLocaleDateString()}
                          </div>
                          {submission.score !== null && (
                            <div
                              className={`text-sm font-medium ${getScoreColor(submission.score)}`}
                            >
                              {submission.score}/100
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Grading Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedSubmission ? (
          <div className="p-6 space-y-6">
            {/* Student Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedSubmission.user.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedSubmission.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedSubmission.user.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedSubmission.user.email}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>
                      Submitted:{" "}
                      {new Date(
                        selectedSubmission.submittedAt,
                      ).toLocaleString()}
                    </span>
                    <Badge
                      className={getStatusColor(selectedSubmission.status)}
                    >
                      {selectedSubmission.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedSubmission.score !== null && (
                <div className="text-right">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(selectedSubmission.score)}`}
                  >
                    {selectedSubmission.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Score
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Submission Content */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList>
                <TabsTrigger value="content">Lab Report</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="grading">Grading</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Submission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {selectedSubmission.content}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Mock attachments */}
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            network-topology.png
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2.3 MB • Image
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            router-config.cfg
                          </p>
                          <p className="text-xs text-muted-foreground">
                            1.2 KB • Configuration
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grading" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">Score (0-100)</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          max="100"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          placeholder="Enter score"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Grade</Label>
                        <div className="p-2 border rounded-md bg-gray-50">
                          {score ? (
                            <span
                              className={`font-medium ${getScoreColor(Number.parseInt(score))}`}
                            >
                              {Number.parseInt(score) >= 90
                                ? "A"
                                : Number.parseInt(score) >= 80
                                  ? "B"
                                  : Number.parseInt(score) >= 70
                                    ? "C"
                                    : Number.parseInt(score) >= 60
                                      ? "D"
                                      : "F"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide detailed feedback on the student's work..."
                        className="min-h-[150px]"
                      />
                    </div>

                    {/* Grading Rubric */}
                    <div className="space-y-3">
                      <Label>Grading Rubric</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">
                              Network Implementation
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Correct topology and configuration
                            </p>
                          </div>
                          <div className="text-sm font-medium">30 pts</div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">
                              Documentation Quality
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Clear explanations and screenshots
                            </p>
                          </div>
                          <div className="text-sm font-medium">25 pts</div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">
                              Testing & Validation
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Proper testing procedures
                            </p>
                          </div>
                          <div className="text-sm font-medium">25 pts</div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">
                              Problem Solving
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Troubleshooting and solutions
                            </p>
                          </div>
                          <div className="text-sm font-medium">20 pts</div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleGradeSubmit}
                      disabled={!score || !feedback || isGrading}
                      className="w-full"
                    >
                      {isGrading
                        ? "Submitting Grade..."
                        : "Submit Grade & Feedback"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a submission to begin grading</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
