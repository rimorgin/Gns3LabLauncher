"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import { Progress } from "@clnt/components/ui/progress";
import { Checkbox } from "@clnt/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@clnt/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Terminal,
  Copy,
  Eye,
  EyeOff,
  Lightbulb,
  AlertTriangle,
  Info,
  CheckSquare,
  Clock,
  Target,
  Code,
  Monitor,
} from "lucide-react";
import type {
  LabGuide,
  LabSection,
  LabContent,
  LabTask,
  VerificationStep,
} from "@clnt/types/lab";

interface LabGuideProps {
  guide: LabGuide;
  onSectionComplete: (sectionId: string) => void;
  onTaskComplete: (taskId: string) => void;
  onVerificationComplete: (verificationId: string) => void;
  onNavigateSection: (sectionIndex: number) => void;
  isLabRunning: boolean;
}

export function LabGuideComponent({
  guide,
  onSectionComplete,
  onTaskComplete,
  onVerificationComplete,
  onNavigateSection,
  isLabRunning,
}: LabGuideProps) {
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("tasks");
  const [expandedOutputs, setExpandedOutputs] = useState<{
    [key: string]: boolean;
  }>({});

  const currentSection = guide.sections[guide.currentSection];
  const progress =
    (guide.completedSections.length / guide.sections.length) * 100;

  useEffect(() => {
    setActiveTab("tasks");
  }, [guide.currentSection]);

  const toggleHint = (id: string) => {
    setShowHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOutput = (id: string) => {
    setExpandedOutputs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSectionIcon = (type: LabSection["type"]) => {
    const icons = {
      introduction: Info,
      step: Target,
      verification: CheckSquare,
      troubleshooting: AlertTriangle,
      summary: CheckCircle,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getSectionColor = (type: LabSection["type"]) => {
    const colors = {
      introduction: "bg-blue-100 text-blue-800",
      step: "bg-green-100 text-green-800",
      verification: "bg-purple-100 text-purple-800",
      troubleshooting: "bg-yellow-100 text-yellow-800",
      summary: "bg-gray-100 text-gray-800",
    };
    return colors[type];
  };

  const renderContent = (content: LabContent) => {
    switch (content.type) {
      case "text":
        return (
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );

      case "code":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {content.metadata?.device
                    ? `${content.metadata.device} Configuration`
                    : "Code"}
                </span>
                {content.metadata?.language && (
                  <Badge variant="outline" className="text-xs">
                    {content.metadata.language}
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(content.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{content.content}</pre>
            </div>
          </div>
        );

      case "terminal":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {content.metadata?.device
                    ? `${content.metadata.device} Terminal`
                    : "Terminal Command"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(content.metadata?.command || "")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {content.metadata?.expected_output && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleOutput(content.id)}
                  >
                    {expandedOutputs[content.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                <span className="text-blue-400">
                  {content.metadata?.device || "device"}@lab:~$
                </span>{" "}
                {content.metadata?.command || content.content}
              </div>
              {expandedOutputs[content.id] &&
                content.metadata?.expected_output && (
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {content.metadata.expected_output}
                  </div>
                )}
            </div>
          </div>
        );

      case "callout": {
        const calloutType = content.metadata?.callout_type || "info";
        const calloutIcons = {
          info: Info,
          warning: AlertTriangle,
          success: CheckCircle,
          error: AlertTriangle,
          tip: Lightbulb,
        };
        const CalloutIcon =
          calloutIcons[calloutType as keyof typeof calloutIcons];

        return (
          <Alert
            className={`border-l-4 ${
              calloutType === "warning" || calloutType === "error"
                ? "border-l-yellow-500"
                : calloutType === "success"
                  ? "border-l-green-500"
                  : calloutType === "tip"
                    ? "border-l-blue-500"
                    : "border-l-gray-500"
            }`}
          >
            <CalloutIcon className="h-4 w-4" />
            <AlertDescription>{content.content}</AlertDescription>
          </Alert>
        );
      }
      case "image":
        return (
          <div className="text-center">
            <img
              src={content.content || "/placeholder.svg"}
              alt="Lab illustration"
              className="max-w-full h-auto rounded-lg border mx-auto"
            />
          </div>
        );

      case "topology":
        return (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="h-4 w-4" />
              <span className="font-medium">Network Topology</span>
            </div>
            <div className="text-center text-muted-foreground">
              Interactive topology view would be rendered here
            </div>
          </div>
        );

      default:
        return <div>{content.content}</div>;
    }
  };

  const renderTask = (task: LabTask) => {
    return (
      <Card
        key={task.id}
        className={`${task.isCompleted ? "bg-blue-100/20 border-blue-200/80" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={() => onTaskComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-3">
              <div className="font-medium">{task.description}</div>

              {task.device && (
                <Badge variant="outline" className="text-xs">
                  Device: {task.device}
                </Badge>
              )}

              {task.commands && task.commands.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Commands to execute:
                  </div>
                  {task.commands.map((command, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="bg-gray-900/90 text-gray-100 p-2 rounded font-mono text-sm flex-1">
                        {command}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(command)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {task.expectedResult && (
                <div className="text-sm text-muted-foreground">
                  <strong>Expected Result:</strong> {task.expectedResult}
                </div>
              )}

              {task.hints.length > 0 && (
                <div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleHint(task.id)}
                    className="text-blue-600"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHints[task.id] ? "Hide Hints" : "Show Hints"}
                  </Button>
                  {showHints[task.id] && (
                    <div className="mt-2 space-y-1">
                      {task.hints.map((hint, index) => (
                        <div
                          key={index}
                          className="text-sm text-blue-600 bg-blue-50 p-2 rounded"
                        >
                          💡 {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderVerification = (verification: VerificationStep) => {
    return (
      <Card
        key={verification.id}
        className={`${verification.isCompleted ? "bg-blue-100/20 border-blue-200/80" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={verification.isCompleted}
              onCheckedChange={() => onVerificationComplete(verification.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-3">
              <div className="font-medium">{verification.description}</div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Verification Command:</div>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm flex-1">
                    {verification.device}# {verification.command}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(verification.command)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Expected Output:</div>
                <div className="p-2 rounded font-mono text-sm whitespace-pre-wrap border-2 w-[95%]">
                  {verification.expectedOutput}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!currentSection) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No lab guide available</h3>
        <p className="text-muted-foreground">
          The lab guide is not properly configured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getSectionIcon(currentSection.type)}
                {currentSection.title}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={getSectionColor(currentSection.type)}>
                  {currentSection.type}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentSection.estimatedTime} min
                </div>
                <div className="text-sm text-muted-foreground">
                  Section {guide.currentSection + 1} of {guide.sections.length}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Lab Status Alert */}
      {!isLabRunning && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lab Environment Required</AlertTitle>
          <AlertDescription>
            Please launch the lab environment to follow along with the hands-on
            exercises.
          </AlertDescription>
        </Alert>
      )}

      {/* Section Content */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {currentSection.content.map((content) => (
              <div key={content.id}>{renderContent(content)}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks and Verification */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">
            Tasks ({currentSection.tasks.filter((t) => t.isCompleted).length}/
            {currentSection.tasks.length})
          </TabsTrigger>
          <TabsTrigger value="verification">
            Verification (
            {currentSection.verification.filter((v) => v.isCompleted).length}/
            {currentSection.verification.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {currentSection.tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No tasks for this section
                </h3>
                <p className="text-muted-foreground">
                  This section is informational only.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {currentSection.tasks.map((task) => renderTask(task))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          {currentSection.verification.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No verification steps
                </h3>
                <p className="text-muted-foreground">
                  Complete the tasks to proceed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {currentSection.verification.map((verification) =>
                renderVerification(verification),
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => onNavigateSection(guide.currentSection - 1)}
              disabled={guide.currentSection === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Section
            </Button>

            <div className="flex items-center gap-2">
              {guide.completedSections.includes(guide.currentSection) ? (
                <Button
                  variant="default"
                  className="bg-green-600 text-green-200 hover:bg-green-500"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Button>
              ) : (
                <Button
                  onClick={() => onSectionComplete(currentSection.id)}
                  disabled={
                    currentSection.tasks.some((t) => !t.isCompleted) ||
                    currentSection.verification.some((v) => !v.isCompleted)
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>

            <Button
              onClick={() => onNavigateSection(guide.currentSection + 1)}
              disabled={
                guide.currentSection === guide.sections.length - 1 ||
                !guide.completedSections.includes(guide.currentSection)
              }
            >
              Next Section
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
