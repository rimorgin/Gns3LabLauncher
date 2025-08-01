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
  AlertTriangle,
  Info,
  CheckSquare,
  Clock,
  Target,
} from "lucide-react";
import type { LabGuide, LabSection, LabProgress } from "@clnt/types/lab";
import LabGuideVerification from "./lab-guide-verification";
import LabGuideTask from "./lab-guide-task";
import LabGuideContent from "./lab-guide-content";

interface LabGuideProps {
  guide: LabGuide;
  labProgress: LabProgress;
  onSectionComplete: (sectionId: string) => void;
  onTaskComplete: (taskId: string) => void;
  onVerificationComplete: (verificationId: string) => void;
  onNavigateSection: (sectionIndex: number) => void;
  isLabRunning: boolean;
  onSubmitLab: (
    verificationFiles: {
      verificationId: string;
      file: File;
    }[],
  ) => void;
}

export function LabGuideComponent({
  guide,
  labProgress,
  onSectionComplete,
  onTaskComplete,
  onVerificationComplete,
  onNavigateSection,
  isLabRunning,
  onSubmitLab,
}: LabGuideProps) {
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("tasks");
  const [expandedOutputs, setExpandedOutputs] = useState<{
    [key: string]: boolean;
  }>({});
  const [verificationFiles, setVerificationFiles] = useState<{
    [verificationId: string]: File;
  }>({});
  const [previewUrls, setPreviewUrls] = useState<{
    [verificationId: string]: string;
  }>({});

  const currentSection = guide.sections[guide.currentSection];
  const progress =
    (labProgress.completedSections.length / guide.sections.length) * 100;

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

  const handleSubmitLab = () => {
    const entries = Object.entries(verificationFiles);

    const verificationFileArray = entries.map(([verificationId, file]) => ({
      verificationId,
      file,
    }));

    onSubmitLab(verificationFileArray);
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

  const canSubmitLab = guide.sections.every((section) => {
    return (
      section.tasks.every((t) => labProgress.completedTasks.includes(t.id)) &&
      section.verifications.every((v) => {
        if (!labProgress.completedVerifications.includes(v.id)) return false;
        if (v.requiresScreenshot && !verificationFiles[v.id]) return false;
        return true;
      })
    );
  });

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
              <LabGuideContent
                key={content.id}
                content={content}
                expandedOutputs={expandedOutputs}
                toggleOutput={toggleOutput}
                copyToClipboard={copyToClipboard}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks and Verification */}
      {(currentSection.tasks.length > 0 ||
        currentSection.verifications.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">
              Tasks (
              {
                currentSection.tasks.filter((t) =>
                  labProgress.completedTasks.includes(t.id),
                ).length
              }
              /{currentSection.tasks.length})
            </TabsTrigger>
            <TabsTrigger value="verification">
              Verification (
              {
                currentSection.verifications.filter((v) =>
                  labProgress.completedVerifications.includes(v.id),
                ).length
              }
              /{currentSection.verifications.length})
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
                {currentSection.tasks.map((task) => (
                  <LabGuideTask
                    key={task.id}
                    task={task}
                    isCompleted={labProgress.completedTasks.includes(task.id)}
                    showHint={showHints[task.id]}
                    onTaskComplete={onTaskComplete}
                    toggleHint={toggleHint}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            {currentSection.verifications.length === 0 ? (
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
                {currentSection.verifications.map((verification) => (
                  <LabGuideVerification
                    key={verification.id}
                    verification={verification}
                    isCompleted={labProgress.completedVerifications.includes(
                      verification.id,
                    )}
                    file={verificationFiles[verification.id] || null}
                    previewUrl={previewUrls[verification.id] || null}
                    onVerificationComplete={onVerificationComplete}
                    setVerificationFiles={setVerificationFiles}
                    setPreviewUrls={setPreviewUrls}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
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
              {labProgress.completedSections.includes(guide.currentSection) ? (
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
                    currentSection.tasks.some(
                      (t) => !labProgress.completedTasks.includes(t.id),
                    ) ||
                    currentSection.verifications.some(
                      (v) => !labProgress.completedVerifications.includes(v.id),
                    )
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>

            {/* Next Section or Submit */}
            {guide.currentSection === guide.sections.length - 1 ? (
              <Button
                variant={canSubmitLab ? "default" : "outline"}
                onClick={handleSubmitLab}
                disabled={!canSubmitLab}
              >
                Submit Lab Progress
              </Button>
            ) : (
              <Button
                onClick={() => onNavigateSection(guide.currentSection + 1)}
                disabled={
                  !labProgress.completedSections.includes(guide.currentSection)
                }
              >
                Next Section
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
