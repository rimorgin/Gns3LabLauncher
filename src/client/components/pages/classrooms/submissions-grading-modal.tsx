import { Card } from "@clnt/components/ui/card";
import { useState } from "react";
import { Button } from "@clnt/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@clnt/components/ui/drawer";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Textarea } from "@clnt/components/ui/textarea";
import { Badge } from "@clnt/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { Separator } from "@clnt/components/ui/separator";
import {
  Download,
  FileText,
  FlaskConical,
  User,
  Clock,
  AlertTriangle,
  Router,
  Network,
  Monitor,
  Server,
  BrickWallFire,
} from "lucide-react";
import { LabSubmission, LabSubmissionFile } from "@clnt/types/submission";
import { IUser } from "@clnt/types/auth-types";
import {
  Lab,
  LabSection,
  LabContent,
  LabTask,
  VerificationStep,
} from "@clnt/types/lab";
import { IconCloud } from "@tabler/icons-react";

interface LabSubmissionGradingModalProps {
  currentUser: IUser;
  lab: Lab | null;
  submission: LabSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveGrade: (submissionId: string, grade: number, feedback: string) => void;
}

export function LabSubmissionGradingModal({
  currentUser,
  lab,
  submission,
  isOpen,
  onClose,
  onSaveGrade,
}: LabSubmissionGradingModalProps) {
  const [grade, setGrade] = useState(submission?.grade?.toString() || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isStudent = currentUser.role === "student";

  if (!submission) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSaveGrade(submission.id, Number.parseFloat(grade), feedback);
      onClose();
    } catch (error) {
      console.error("Error saving grade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "late":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDevicesColor = (type: string) => {
    const colors = {
      router: "text-blue-700",
      switch: "text-green-600",
      pc: "text-gray-700",
      server: "text-amber-700",
      firewall: "text-red-900",
      cloud: "text-cyan-600",
    };
    return colors[type as keyof typeof colors] || "text-blue-700";
  };

  const getDevicesIcon = (type: string) => {
    const icons = {
      router: Router,
      switch: Network,
      pc: Monitor,
      server: Server,
      firewall: BrickWallFire,
      cloud: IconCloud,
    };
    const Icon = icons[type as keyof typeof icons] || Monitor;
    const iconColor = getDevicesColor(type);
    return <Icon className={`${iconColor} h-6 w-6`} />;
  };

  const renderTopology = () => {
    const nodes = lab?.environment.topology.nodes ?? [];
    const notes = lab?.environment.topology.notes ?? [];
    const links = lab?.environment.topology.links ?? [];

    if (nodes.length === 0 && notes.length === 0)
      return (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            Lab Environment is not yet configured
          </h3>
        </div>
      );

    const offset = 100;

    // collect all x/y points for nodes and notes
    const allPoints = [
      ...nodes.map((n) => ({ x: n.x, y: n.y })),
      ...notes.map((n) => ({ x: n.x, y: n.y })),
      ...notes.map((n) => ({ x: n.x + n.width, y: n.y + n.height })),
    ];

    const minX = Math.min(...allPoints.map((p) => p.x));
    const maxX = Math.max(...allPoints.map((p) => p.x));
    const minY = Math.min(...allPoints.map((p) => p.y));
    const maxY = Math.max(...allPoints.map((p) => p.y));

    const newWidth = maxX - minX + offset * 2;
    const newHeight = maxY - minY + offset * 2;

    return (
      <div className="relative bg-gray-50 rounded-lg overflow-hidden">
        <div className="w-full border border-gray-200 rounded bg-white">
          <svg
            className="w-full h-auto max-h-96"
            viewBox={`${minX - offset} ${minY - offset} ${newWidth} ${newHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* grid */}
            <defs>
              <pattern
                id="grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect
              x={minX - offset}
              y={minY - offset}
              width={newWidth}
              height={newHeight}
              fill="url(#grid)"
            />

            {/* Links */}
            {links.map((link) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const unitX = dx / length;
              const unitY = dy / length;
              const portOffset = 100;

              return (
                <g key={link.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#3B3B3B"
                    strokeWidth="2"
                    strokeDasharray={link.status === "down" ? "5,5" : "none"}
                  />

                  <foreignObject
                    x={sourceNode.x + unitX * portOffset}
                    y={sourceNode.y + unitY * portOffset}
                    width="100"
                    height="50"
                    style={{ pointerEvents: "none" }}
                  >
                    <p className="w-max text-xs md:text-sm text-black bg-white/80 shadow rounded px-1">
                      {link.sourcePort}
                    </p>
                  </foreignObject>

                  <foreignObject
                    x={targetNode.x - unitX * portOffset}
                    y={targetNode.y - unitY * portOffset}
                    width="100"
                    height="50"
                    style={{ pointerEvents: "none" }}
                  >
                    <p className="w-max text-xs md:text-sm text-black bg-white/80 shadow rounded px-1">
                      {link.targetPort}
                    </p>
                  </foreignObject>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  fill="white"
                  stroke="#3B3B3B"
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-blue-500"
                />
                <text
                  x={node.x}
                  y={node.y + 40}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  {node.name}
                </text>
                <foreignObject
                  x={node.x - 12}
                  y={node.y - 12}
                  width="24"
                  height="24"
                >
                  <div className="flex items-center justify-center text-gray-600">
                    {getDevicesIcon(node.type)}
                  </div>
                </foreignObject>
              </g>
            ))}

            {/* Notes */}
            {notes.map((note) => (
              <g key={note.id}>
                <foreignObject
                  x={note.x}
                  y={note.y}
                  width={note.width}
                  height={note.height}
                >
                  <p className="font-medium text-gray-700 text-sm">
                    {note.text}
                  </p>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const renderLabForGrading = () => {
    if (!lab) {
      return (
        <div className="text-center text-muted-foreground py-8">
          Lab details not available for grading.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h4 className="font-medium flex items-center gap-2">
          <FlaskConical className="h-4 w-4" />
          Lab Content for Grading
        </h4>
        <div>
          <h6 className="font-medium mb-3">Lab Topology Overview</h6>
          <div className="w-full max-w-4xl">{renderTopology()}</div>
        </div>

        {lab.guide?.sections && lab.guide.sections.length > 0 ? (
          lab.guide.sections.map((section: LabSection) => (
            <Card key={section.id} className="p-4">
              <h5 className="font-semibold text-lg mb-3">{section.title}</h5>
              {section.type === "verification" &&
                section.verifications &&
                section.verifications.length > 0 && (
                  <div className="space-y-4">
                    <h6 className="font-medium text-md">Verification Steps:</h6>
                    {section.verifications.map(
                      (verification: VerificationStep) => {
                        const submittedFile = submission.files.find(
                          (file: LabSubmissionFile) =>
                            file.name === verification.id,
                        );
                        return (
                          <div
                            key={verification.id}
                            className="border rounded-md p-3 space-y-2"
                          >
                            <p className="text-sm font-medium">
                              {verification.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              <strong>Device:</strong> {verification.device}
                            </div>
                            {verification.commands &&
                              verification.commands.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  <strong>Commands:</strong>{" "}
                                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto text-xs">
                                    {verification.commands.join("\n")}
                                  </pre>
                                </div>
                              )}
                            {verification.expectedOutput &&
                              verification.expectedOutput.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  <strong>Expected Output:</strong>{" "}
                                  <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto text-xs">
                                    {verification.expectedOutput.join("\n")}
                                  </pre>
                                </div>
                              )}
                            {verification.requiresScreenshot && (
                              <Badge variant="outline" className="mt-2">
                                Requires Screenshot
                              </Badge>
                            )}
                            {submittedFile ? (
                              <div className="flex items-center justify-between mt-3 p-2 bg-green-50 rounded-md">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-green-600" />
                                  <div>
                                    <div className="text-sm font-medium text-green-800">
                                      Submitted File:{" "}
                                      {submittedFile.name || "Unnamed File"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Uploaded:{" "}
                                      {new Date(
                                        submittedFile.uploadedAt,
                                      ).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={submittedFile.url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="h-4 w-4 text-green-600" />
                                  </a>
                                </Button>
                              </div>
                            ) : (
                              <div className="text-sm text-red-600 mt-3">
                                No matching file submitted for this verification
                                step.
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              {section.content && section.content.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h6 className="font-medium text-md">Content:</h6>
                  {section.content.map((contentItem: LabContent) => (
                    <div
                      key={contentItem.id}
                      className="text-sm text-muted-foreground"
                    >
                      {contentItem.type === "text" && (
                        <p>{contentItem.content}</p>
                      )}
                      {contentItem.type === "code" && (
                        <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto text-xs">
                          <code>{contentItem.content}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {section.tasks && section.tasks.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h6 className="font-medium text-md">Tasks:</h6>
                  {section.tasks.map((task: LabTask) => (
                    <div
                      key={task.id}
                      className="text-sm text-muted-foreground"
                    >
                      <p>{task.description}</p>
                      {task.commands && task.commands.length > 0 && (
                        <pre className="bg-gray-100 p-2 rounded-md mt-1 overflow-x-auto text-xs">
                          {task.commands.join("\n")}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            No lab guide sections available.
          </div>
        )}
      </div>
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[95vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Grade Lab Submission - {submission.lab.title}
          </DrawerTitle>
          <DrawerDescription>
            Review and grade the student's lab submission for{" "}
            {submission.project.projectName}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-6">
          {/* Student, Lab, and Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Student Information
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          submission.student.user.avatar || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {submission.student.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {submission.student.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {submission.student.user.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {submission.student.user.email}
                    </div>
                    {submission.student.isOnline ? (
                      <div className="text-xs text-green-600">Online</div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Last active:{" "}
                        {submission.student.lastActiveAt
                          ? new Date(
                              submission.student.lastActiveAt,
                            ).toLocaleDateString()
                          : "Unknown"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Lab Information
                </h4>
                <div>
                  <div className="font-medium">{submission.lab.title}</div>
                  {submission.lab.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {submission.lab.description}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      Max Grade:
                    </span>
                    <span className="font-medium">
                      {submission.lab.maxGrade}
                    </span>
                  </div>
                  {submission.lab.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Due Date:
                      </span>
                      <span className="text-sm">
                        {new Date(submission.lab.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Project Information
                </h4>
                <div>
                  <div className="font-medium">
                    {submission.project.projectName}
                  </div>
                  {submission.project.projectDescription && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {submission.project.projectDescription}
                    </div>
                  )}
                  {submission.project.tags && (
                    <Badge variant="outline" className="text-xs mt-2">
                      {submission.project.tags}
                    </Badge>
                  )}
                  {submission.project.byGroupSubmissions && (
                    <Badge variant="secondary" className="text-xs mt-2 ml-2">
                      Group Project
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Submission Details */}
          <Card className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Submission Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Submitted At
                  </div>
                  <div className="font-medium">
                    {submission.submittedAt
                      ? new Date(submission.submittedAt).toLocaleString()
                      : "Not submitted"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status || "pending"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Attempt Number
                  </div>
                  <Badge variant="secondary">#{submission.attempt}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Files Submitted
                  </div>
                  <div className="font-medium">
                    {submission.files.length} files
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Lab Content for Grading */}
          {renderLabForGrading()}

          <Separator />

          {/* Submission Files */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Submitted Files
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {submission.files?.length > 0 ? (
                submission.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {file.name || "Unnamed File"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={file.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground col-span-2 text-center py-4">
                  No files submitted
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Grading Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Grading</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">
                  Grade (out of {submission.lab.maxGrade})
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max={submission.lab.maxGrade}
                  step="0.1"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder={
                    isStudent
                      ? "No grade from your instructor yet"
                      : "Enter grade"
                  }
                  disabled={isStudent}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="flex items-center h-10">
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status || "pending"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  isStudent
                    ? "No detailed feedbacks yet from your instructor"
                    : "Provide detailed feedback for the student..."
                }
                rows={4}
                disabled={isStudent}
              />
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-shrink-0">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!isStudent && (
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Grade"}
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
