"use client";

import { useState } from "react";
import { LabEnvironmentComponent } from "@clnt/components/pages/lab/lab-environment";
import { LabGuideComponent } from "@clnt/components/pages/lab/lab-guide";
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
import {
  ArrowLeft,
  Clock,
  Target,
  Users,
  BookOpen,
  Play,
  CheckCircle,
  Network,
} from "lucide-react";
import type { Lab, LabProgress } from "@clnt/types/lab";
import { labTemplates } from "@clnt/constants/data";
import router from "../route-layout";
import socket from "@clnt/lib/socket";
import { useUser } from "@clnt/lib/auth";
import {
  useStartContainerInstance,
  useStopContainerInstance,
} from "@clnt/lib/mutations/lab/lab-mutation";
import { toast } from "sonner";
import { LockLabGuideOverlay } from "@clnt/components/pages/lab/lock-lab-guide-overlay";

// Mock lab data
const mockLab: Lab = labTemplates[3];

export default function LabPageRoute() {
  const user = useUser();
  const containerName = user.data?.username;
  const startContainer = useStartContainerInstance();
  const stopContainer = useStopContainerInstance();
  const [lab] = useState<Lab>(mockLab);
  const [isLabRunning, setIsLabRunning] = useState(false);
  const [isLabLoading, setIsLabLoading] = useState(false);
  const [progress, setProgress] = useState<LabProgress>({
    labId: lab.id,
    userId: "current_user",
    currentSection: 0,
    completedSections: [],
    completedTasks: [],
    completedVerifications: [],
    startedAt: new Date(),
    status: "not_started",
  });

  if (!containerName) {
    return;
  }

  const handleLaunchLab = async () => {
    setIsLabLoading(true);
    // Simulate lab startup
    await toast.promise(startContainer.mutateAsync(containerName), {
      loading: "Starting lab instance...",
      success: (response) => {
        setIsLabRunning(true);
        setIsLabLoading(false);
        setProgress((prev) => ({
          ...prev,
          status: "in_progress",
          startedAt: new Date(),
        }));
        return response.data.message;
      },
      error: () => {
        setIsLabLoading(false);
        return "Error starting lab instance";
      },
    });
    socket.emit("start-container-logs", { containerName: containerName });
  };

  const handleStopLab = async () => {
    await toast.promise(stopContainer.mutateAsync(containerName), {
      loading: "Stopping lab instance...",
      success: () => {
        setIsLabRunning(false);
        socket.emit("stop-container-logs", { containerName: containerName });
        return "Stopped lab instance";
      },
      error: "Error stopping lab instance",
    });
  };

  const handleResetLab = async () => {
    setIsLabLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLabLoading(false);
    // Reset progress
    setProgress((prev) => ({
      ...prev,
      completedTasks: [],
      completedVerifications: [],
      completedSections: [],
      currentSection: 0,
    }));
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

      // Update lab guide
      lab.guide.completedSections = [
        ...lab.guide.completedSections,
        sectionIndex,
      ];
    }
  };

  const handleTaskComplete = (taskId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedTasks: [...prev.completedTasks, taskId],
      lastAccessedAt: new Date(),
    }));

    // Update task in lab guide
    lab.guide.sections.forEach((section) => {
      const task = section.tasks.find((t) => t.id === taskId);
      if (task) {
        task.isCompleted = true;
      }
    });
  };

  const handleVerificationComplete = (verificationId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedVerifications: [...prev.completedVerifications, verificationId],
      lastAccessedAt: new Date(),
    }));

    // Update verification in lab guide
    lab.guide.sections.forEach((section) => {
      const verification = section.verification.find(
        (v) => v.id === verificationId,
      );
      if (verification) {
        verification.isCompleted = true;
      }
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
    router.navigate("/");
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
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={handleExitLab} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Labs
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
                    <Users className="h-4 w-4" />
                    {lab.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              {/* <div className="text-2xl font-bold text-primary">
                {progress.status}
              </div> */}
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
                    onSectionComplete={handleSectionComplete}
                    onTaskComplete={handleTaskComplete}
                    onVerificationComplete={handleVerificationComplete}
                    onNavigateSection={handleNavigateSection}
                    isLabRunning={isLabRunning}
                  />
                </div>
              </TabsContent>

              <TabsContent value="environment">
                <LabEnvironmentComponent
                  environment={lab.labEnvironment}
                  onLaunch={handleLaunchLab}
                  onStop={handleStopLab}
                  onReset={handleResetLab}
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
