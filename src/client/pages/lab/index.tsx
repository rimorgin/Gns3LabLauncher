"use client";

import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import router from "../route-layout";
import socket from "@clnt/lib/socket";
import { useUser } from "@clnt/lib/auth";
import { useLabQuery } from "@clnt/lib/queries/lab-query";
import {
  useStartContainerInstance,
  useStopContainerInstance,
} from "@clnt/lib/mutations/lab/lab-start-or-stop-mutation";
import { useSubmitLab } from "@clnt/lib/mutations/lab/lab-submission-submit-mutation";
import { toast } from "sonner";

import { LabEnvironmentComponent } from "@clnt/components/pages/lab/lab-environment";
import { LabGuideComponent } from "@clnt/components/pages/lab/lab-guide";
import { LockLabGuideOverlay } from "@clnt/components/pages/lab/lock-lab-guide-overlay";
import Loader from "@clnt/components/common/loader";
import PageMeta from "@clnt/components/common/page-meta";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import { Progress } from "@clnt/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";

import { LabProgress } from "@clnt/types/lab";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Network,
  Play,
  Target,
  Users,
} from "lucide-react";
import { IconDirectionArrowsFilled } from "@tabler/icons-react";

export default function LabPageRoute() {
  const { classroomId, projectId, labId } = useParams();
  const user = useUser();
  const containerName = user.data?.username.toLowerCase();

  const startContainer = useStartContainerInstance();
  const stopContainer = useStopContainerInstance();
  const { mutateAsync } = useSubmitLab();
  const { data: lab, isLoading, isError } = useLabQuery(labId ?? "");
  const [labInstanceAddress, setLabInstanceAddress] = useState("");
  const [isLabRunning, setIsLabRunning] = useState(false);
  const [isLabLoading, setIsLabLoading] = useState(false);

  const [progress, setProgress] = useState<LabProgress>({
    labId: labId ?? "",
    userId: "current_user",
    currentSection: 0,
    completedSections: [],
    completedTasks: [],
    completedVerifications: [],
    startedAt: new Date(),
    status: "not_started",
  });

  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const LAB_TIMEOUT_ENABLED = lab?.settings?.onForceExitUponTimeout;
  const LAB_ESTIMATED_TIME = lab?.estimatedTime;

  useEffect(() => {
    if (
      isLabRunning &&
      LAB_TIMEOUT_ENABLED &&
      LAB_ESTIMATED_TIME &&
      progress?.startedAt
    ) {
      const start = new Date(progress.startedAt).getTime();
      const end = start + LAB_ESTIMATED_TIME * 60 * 1000;

      const updateTimer = () => {
        const now = Date.now();
        const timeLeft = end - now;

        if (timeLeft <= 0) {
          setRemainingTime(0);
          return;
        }

        setRemainingTime(Math.floor(timeLeft / 1000)); // in seconds
      };

      updateTimer(); // immediate update
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [
    isLabRunning,
    LAB_TIMEOUT_ENABLED,
    LAB_ESTIMATED_TIME,
    progress?.startedAt,
  ]);

  if (!containerName || !labId || !classroomId || !projectId) {
    return <Navigate to="errorPage" />;
  }

  if (isLoading) return <Loader />;
  if (isError || !lab) return <Navigate to="errorPage" />;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return h > 0
      ? `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOpenLabInstance = () => {
    window.open(`https://${labInstanceAddress}:3080`, "_blank");
  };

  const handleLaunchLab = async () => {
    setIsLabLoading(true);
    await toast.promise(startContainer.mutateAsync(containerName), {
      loading: "Starting lab instance...",
      success: (response) => {
        setProgress((prev) => ({
          ...prev,
          status: "in_progress",
          startedAt: new Date(),
        }));
        socket.emit("start-container-logs", { containerName });
        setLabInstanceAddress(response.data.tunIp);
        setIsLabRunning(true);
        return response.data.message;
      },
      error: () => "Error starting lab instance",
      finally: () => {
        setIsLabLoading(false);
      },
    });
  };

  const handleStopLab = async () => {
    setIsLabLoading(true);
    await toast.promise(stopContainer.mutateAsync(containerName), {
      loading: "Stopping lab instance...",
      success: () => {
        socket.emit("stop-container-logs", { containerName });
        return "Stopped lab instance";
      },
      error: "Error stopping lab instance",
      finally: () => {
        setIsLabRunning(false);
        setIsLabLoading(false);
      },
    });
  };

  const handleSubmitLab = (
    verificationFiles: { verificationId: string; file: File }[],
  ) => {
    const formData = new FormData();
    formData.append("classroomId", classroomId);
    formData.append("projectId", projectId);
    formData.append("labId", labId);

    verificationFiles.forEach(({ verificationId, file }) => {
      formData.append(`files[${verificationId}]`, file);
    });

    formData.append("completedTasks", JSON.stringify(progress.completedTasks));
    formData.append(
      "completedVerifications",
      JSON.stringify(progress.completedVerifications),
    );
    formData.append(
      "completedSections",
      JSON.stringify(progress.completedSections),
    );

    toast.promise(mutateAsync(formData), {
      loading: "Submitting lab...",
      success: "Submitted successfully!",
      error: "Submission failed.",
      finally: () => {
        handleStopLab();
      },
      position: "top-center",
    });
  };

  const handleSectionComplete = (sectionId: string) => {
    const sectionIndex = lab.guide.sections.findIndex(
      (s) => s.id === sectionId,
    );
    if (sectionIndex !== -1) {
      setProgress((prev) => ({
        ...prev,
        completedSections: [...prev.completedSections, sectionIndex],
        lastAccessedAt: new Date(),
      }));
    }
  };

  const handleTaskComplete = (taskId: string) => {
    setProgress((prev) => {
      if (prev.completedTasks.includes(taskId)) return prev;
      return {
        ...prev,
        completedTasks: [...prev.completedTasks, taskId],
        lastAccessedAt: new Date(),
      };
    });
  };

  const handleVerificationComplete = (verificationId: string) => {
    setProgress((prev) => {
      if (prev.completedVerifications.includes(verificationId)) return prev;
      return {
        ...prev,
        completedVerifications: [
          ...prev.completedVerifications,
          verificationId,
        ],
        lastAccessedAt: new Date(),
      };
    });
  };

  const handleNavigateSection = (sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < lab.guide.sections.length) {
      lab.guide.currentSection = sectionIndex;
      setProgress((prev) => ({
        ...prev,
        currentSection: sectionIndex,
        lastAccessedAt: new Date(),
      }));
    }
  };

  const handleExitLab = () => {
    router.navigate(`/classrooms/${classroomId}/project/${projectId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors];
  };

  const overallProgress =
    (progress.completedSections.length / lab.guide.sections.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Labs" description="Labs hands on experience" />
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={handleExitLab} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <Network className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold mb-2">{lab.title}</h1>
                <p className="text-muted-foreground mb-3">{lab.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  <Badge className={getDifficultyColor(lab.difficulty)}>
                    {lab.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lab.estimatedTime} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {lab.objectives.length} objectives
                  </div>
                  <div className="flex items-center gap-1">
                    <IconDirectionArrowsFilled className="h-4 w-4" />
                    {lab.guide.sections.length} Guides
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {lab.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              {remainingTime !== null && (
                <div className="text-2xl font-bold text-primary">
                  {formatTime(remainingTime)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="guide" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="guide">Lab Guide</TabsTrigger>
                <TabsTrigger value="environment">Lab Environment</TabsTrigger>
              </TabsList>

              <TabsContent value="guide">
                <div className="relative">
                  <LockLabGuideOverlay isLabRunning={isLabRunning} />
                  <LabGuideComponent
                    guide={lab.guide}
                    labProgress={progress}
                    onSectionComplete={handleSectionComplete}
                    onTaskComplete={handleTaskComplete}
                    onVerificationComplete={handleVerificationComplete}
                    onNavigateSection={handleNavigateSection}
                    isLabRunning={isLabRunning}
                    onSubmitLab={handleSubmitLab}
                  />
                </div>
              </TabsContent>

              <TabsContent value="environment">
                <LabEnvironmentComponent
                  environment={lab.environment}
                  onLaunch={handleLaunchLab}
                  onStop={handleStopLab}
                  onOpenLabInstance={handleOpenLabInstance}
                  isRunning={isLabRunning}
                  isLoading={isLabLoading}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lab.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lab.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sections Completed</span>
                    <span>
                      {progress.completedSections.length}/
                      {lab.guide.sections.length}
                    </span>
                  </div>
                  <Progress value={overallProgress} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {progress.completedTasks.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tasks Done
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {progress.completedVerifications.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Verified
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Status:{" "}
                  <Badge
                    variant={
                      progress.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {progress.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Lab Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lab.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-start gap-3 p-2 border rounded hover:bg-muted/50"
                    >
                      <BookOpen className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {resource.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resource.description}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
