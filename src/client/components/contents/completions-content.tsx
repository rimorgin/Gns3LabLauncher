import React from "react";
import PageMeta from "@clnt/components/common/page-meta";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import { Badge } from "@clnt/components/ui/badge";

type SubmissionData = {
  id: string;
  submittedAt: string;
  updatedAt: string;
  fileUrl?: string;
  status?: string;
  grade?: number;
  feedback?: string;
  student?: { userId: string; name: string };
  group?: { id: string; groupName: string };
};

type ProgressData = {
  percent: number;
  status?: string;
  updatedAt: string;
  student?: { userId: string; name: string };
  group?: { id: string; groupName: string };
};

type Props = {
  submissions: SubmissionData[];
  progress: ProgressData[];
};

const ProjectCompletionList: React.FC<Props> = ({ submissions, progress }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {progress.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No progress data yet.
            </p>
          )}
          {progress.map((p) => (
            <Card
              key={`${p.student?.userId || p.group?.id}`}
              className="border rounded-md p-3 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium text-sm">
                  {p.student
                    ? p.student.name
                    : p.group
                      ? `(Group) ${p.group.groupName}`
                      : "Unknown"}
                </div>
                <Badge variant="outline" className="text-xs">
                  {p.status ?? "In Progress"}
                </Badge>
              </div>

              <Progress value={p.percent} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date(p.updatedAt).toLocaleString()}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submissions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {submissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
          {submissions.map((s) => (
            <Card key={s.id} className="border rounded-md p-3 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium text-sm">
                  {s.student
                    ? s.student.name
                    : s.group
                      ? `(Group) ${s.group.groupName}`
                      : "Unknown"}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {s.status ?? "Submitted"}
                </Badge>
              </div>

              <div className="text-sm">
                Grade:{" "}
                {s.grade !== undefined ? (
                  <span className="font-medium">{s.grade}</span>
                ) : (
                  <span className="italic text-muted-foreground">
                    Not graded
                  </span>
                )}
              </div>

              {s.fileUrl && (
                <div className="text-sm">
                  File:{" "}
                  <a
                    href={s.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    View File
                  </a>
                </div>
              )}

              {s.feedback && (
                <div className="text-sm text-muted-foreground">
                  Feedback: {s.feedback}
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Submitted at: {new Date(s.submittedAt).toLocaleString()}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const CompletionsContent = () => {
  return (
    <div className="w-full h-full p-6">
      <PageMeta
        title="Completions"
        description="Project completions overview"
      />

      <h1 className="text-xl font-semibold mb-4">Project Completions</h1>

      <ProjectCompletionList
        submissions={[] /* replace with actual data */}
        progress={[] /* replace with actual data */}
      />
    </div>
  );
};

export default CompletionsContent;
