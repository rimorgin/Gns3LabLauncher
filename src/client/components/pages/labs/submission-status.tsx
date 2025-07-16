import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import { Progress } from "@clnt/components/ui/progress";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Award,
  Calendar,
} from "lucide-react";
import type { Submission } from "@clnt/types/project";

interface SubmissionStatusProps {
  submission: Submission | null;
  onViewSubmission: () => void;
  onEditSubmission: () => void;
}

export function SubmissionStatus({
  submission,
  onViewSubmission,
  onEditSubmission,
}: SubmissionStatusProps) {
  if (!submission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lab Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No submission found for this lab
            </p>
            <Button onClick={onEditSubmission}>Start Submission</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      REVIEWED: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      DRAFT: AlertCircle,
      SUBMITTED: Clock,
      REVIEWED: CheckCircle,
    };
    const Icon = icons[status as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (score: number | null) => {
    if (score === null) return "-";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lab Submission
          </CardTitle>
          <Badge className={getStatusColor(submission.status)}>
            {getStatusIcon(submission.status)}
            <span className="ml-1">{submission.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Submission Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Submitted</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(submission.submittedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {submission.status === "DRAFT" && "Draft saved"}
              {submission.status === "SUBMITTED" && "Under review"}
              {submission.status === "REVIEWED" && "Graded"}
            </p>
          </div>
        </div>

        {/* Score Display */}
        {submission.score !== null && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Grade</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${getScoreColor(submission.score)}`}
                >
                  {submission.score}/100
                </span>
                <Badge
                  variant={submission.score >= 70 ? "default" : "destructive"}
                >
                  {getGradeLetter(submission.score)}
                </Badge>
              </div>
            </div>
            <Progress value={submission.score} className="w-full" />
          </div>
        )}

        {/* Feedback */}
        {submission.feedback && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Instructor Feedback</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {submission.feedback}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onViewSubmission}
            className="flex-1 bg-transparent"
          >
            View Details
          </Button>
          {submission.status !== "REVIEWED" && (
            <Button onClick={onEditSubmission} className="flex-1">
              {submission.status === "DRAFT" ? "Continue" : "Edit"}
            </Button>
          )}
        </div>

        {/* Achievement Badge */}
        {submission.score !== null && submission.score >= 90 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Award className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Excellent Work!
              </p>
              <p className="text-xs text-yellow-700">
                You've achieved an outstanding score on this lab.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
