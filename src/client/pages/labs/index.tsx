"use client";

import { useEffect, useState } from "react";
import { ProjectHeader } from "@clnt/components/pages/labs/project-header";
import { LearningPath } from "@clnt/components/pages/labs/learning-path";
import { LabGuide } from "@clnt/components/pages/labs/lab-guide";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import { Progress } from "@clnt/components/ui/progress";
import {
  BookOpen,
  Users,
  MessageSquare,
  Award,
  Clock,
  Target,
} from "lucide-react";
import type { LearningStep } from "@clnt/types/project";
import { GradingInterface } from "@clnt/components/pages/labs/grading-interface";
import type { Submission } from "@clnt/types/project";
import router from "../route-layout";
import { useParams } from "react-router";
import { useUser } from "@clnt/lib/auth";
import { useProgress } from "@clnt/lib/queries/progress-query";
import Loader from "@clnt/components/common/loader";
import { useProjectsQuery } from "@clnt/lib/queries/projects-query";
import { useProgressPatch } from "@clnt/lib/mutations/progress/progress-mutation";
import { toast } from "sonner";

/* // Mock data - replace with actual API calls
const mockProject: Project = {
  id: "1",
  projectName: "GNS3 Network Simulation Mastery",
  projectDescription:
    "Master network simulation with GNS3 - From beginner to advanced networking concepts. Learn to design, configure, and troubleshoot complex network topologies in a virtual environment.",
  imageUrl: "/placeholder.svg?height=400&width=800",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
  visible: true,
  duration: new Date(2024, 0, 1, 40, 0), // 40 hours
  tags: "NETWORKING" as ProjectTagsEnum,
  progresses: [],
  classrooms: [],
  submissions: [],
}; */

const mockLearningSteps: LearningStep[] = [
  {
    id: "1",
    title: "Introduction to GNS3",
    description: "Learn the basics of GNS3 and network simulation concepts",
    type: "READING",
    estimatedTime: 30,
    prerequisites: [],
    resources: [],
  },
  {
    id: "2",
    title: "Basic Router Configuration",
    description: "Configure basic router settings and interfaces",
    type: "LAB",
    estimatedTime: 45,
    prerequisites: ["Introduction to GNS3"],
    resources: [],
  },
  {
    id: "3",
    title: "Knowledge Check: Basic Concepts",
    description: "Test your understanding of basic networking concepts",
    type: "QUIZ",
    estimatedTime: 15,
    prerequisites: ["Basic Router Configuration"],
    resources: [],
  },
  {
    id: "4",
    title: "Common Network Topologies",
    description: "Design and implement complex network architectures",
    type: "PROJECT",
    estimatedTime: 120,
    prerequisites: ["Knowledge Check: Basic Concepts"],
    resources: [],
  },
];

export default function ProjectPage() {
  const params = useParams();
  const user = useUser();
  const studentId = user.data?.id;
  const projectId = params.projectId;
  const {
    data: progress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useProgress({ projectId, studentId });
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useProjectsQuery({ by_id: projectId, includes: ["projectContent"] });

  const { mutateAsync, status } = useProgressPatch();
  const [learningSteps] = useState<LearningStep[]>(mockLearningSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showLabGuide, setShowLabGuide] = useState(false);
  const [showGrading, setShowGrading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (progress?.percentComplete) {
      const count = Math.round(
        (progress.percentComplete / 100) * learningSteps.length,
      );
      setCompletedSteps(Array.from({ length: count }, (_, i) => i));
    }
  }, [progress]);

  if (!studentId || !projectId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="gap-5 flex flex-col">
            <p className="text-red-500">
              You must be logged in to view this page.
            </p>
            <Button
              variant={"destructive"}
              onClick={() => router.navigate("/")}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isProjectLoading || isProgressLoading || status === "pending") {
    return <Loader />;
  }
  if (isProgressError && isProjectError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Project</CardTitle>
          </CardHeader>
          <CardContent className="gap-5 flex flex-col">
            <p className="text-red-500">
              Unable to load project details. Please try again later.
            </p>
            <Button
              variant={"destructive"}
              onClick={() => router.navigate("/")}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function getStepUrl(projectId: string, stepType: string) {
    switch (stepType) {
      case "READING":
        return `/labs/${projectId}/reading?step=${currentStep}`;
      case "QUIZ":
        return `/labs/${projectId}/quiz?step=${currentStep}`;
      default:
        return `/labs/${projectId}`;
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (learningSteps[stepIndex].type === "LAB") {
      setShowLabGuide(true);
    }
  };

  const handleStartLab = () => {
    setShowLabGuide(true);
    // Here you would integrate with your lab launching system
    console.log("Launching lab environment...");
    toast.promise(
      mutateAsync({
        id: progress.id,
        data: {
          status: "IN_PROGRESS",
          percentComplete: progress?.percentComplete ?? 0,
        },
      }),
      {
        loading: "Starting lab environment...",
        success: "Lab environment started successfully!",
        error: "Failed to start lab environment. Please try again.",
      },
    );
  };

  const handleExitLab = () => {
    router.navigate("/");
  };

  const handleLaunchLab = () => {
    if (!projectId) return;

    const step = learningSteps[currentStep];
    if (!step) return;

    if (step.type === "LAB" || step.type === "PROJECT") {
      setShowLabGuide(true);
    } else {
      const url = getStepUrl(projectId, step.type);
      router.navigate(url);
    }
  };

  const handleGradeSubmission = (
    submissionId: string,
    score: number,
    feedback: string,
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? { ...sub, score, feedback, status: "REVIEWED" as const }
          : sub,
      ),
    );
  };

  const handleShowGrading = () => {
    // Mock submissions - replace with API call
    const mockSubmissions: Submission[] = [
      {
        id: "sub_1",
        userId: "user_1",
        projectId: project.id,
        content: "Detailed lab report with network topology implementation...",
        status: "SUBMITTED",
        score: null,
        feedback: null,
        submittedAt: new Date(),
      },
      {
        id: "sub_2",
        userId: "user_2",
        projectId: project.id,
        content: "Complete network configuration with OSPF routing...",
        status: "REVIEWED",
        score: 85,
        feedback:
          "Good work on the OSPF configuration. Consider adding more detailed documentation.",
        submittedAt: new Date(),
      },
    ];
    setSubmissions(mockSubmissions);
    setShowGrading(true);
  };

  if (showLabGuide) {
    return (
      <div className="h-1/1  flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowLabGuide(false)}
              className="mb-4"
            >
              ← Back to Learning Path
            </Button>
          </div>

          <LabGuide
            labTitle={learningSteps[currentStep]?.title}
            labType={learningSteps[currentStep].type}
            objectives={[
              "Configure basic router settings",
              "Set up network interfaces",
              "Test network connectivity",
              "Document your configuration",
            ]}
            prerequisites={[
              "Basic understanding of IP addressing",
              "Familiarity with command line interface",
            ]}
            estimatedTime={learningSteps[currentStep]?.estimatedTime || 60}
            difficulty="INTERMEDIATE"
            projectId={project.id}
            userId="current_user_id" // Replace with actual user ID
            onLaunchLab={handleLaunchLab}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader
        project={project}
        progress={progress}
        onStartLab={handleStartLab}
        onExitLab={handleExitLab}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {project?.projectDescription}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Network Design</h4>
                          <p className="text-sm text-muted-foreground">
                            Design scalable network architectures
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Device Configuration</h4>
                          <p className="text-sm text-muted-foreground">
                            Configure routers, switches, and firewalls
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Troubleshooting</h4>
                          <p className="text-sm text-muted-foreground">
                            Diagnose and resolve network issues
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Best Practices</h4>
                          <p className="text-sm text-muted-foreground">
                            Industry-standard networking practices
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <LearningPath
                  steps={learningSteps}
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                />
              </TabsContent>

              <TabsContent value="discussions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Project Discussions
                    </CardTitle>
                    <CardDescription>
                      Connect with other learners and get help from instructors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">JD</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                John Doe
                              </span>
                              <span className="text-xs text-muted-foreground">
                                2 hours ago
                              </span>
                            </div>
                            <p className="text-sm">
                              Having trouble with OSPF configuration in Lab 3.
                              Any tips?
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>3 replies</span>
                              <span>5 likes</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">SM</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                Sarah Miller
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                Instructor
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                1 day ago
                              </span>
                            </div>
                            <p className="text-sm">
                              Great work on the network topology designs!
                              Remember to document your configurations.
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>8 replies</span>
                              <span>12 likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>
                      {Math.round(
                        (completedSteps.length / (learningSteps.length - 1)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (completedSteps.length / (learningSteps.length - 1)) * 100
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {completedSteps.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">
                      {learningSteps.length - completedSteps.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Remaining
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Enrolled</span>
                  </div>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="font-medium">40 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Certificate</span>
                  </div>
                  <span className="font-medium">Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Lessons</span>
                  </div>
                  <span className="font-medium">{learningSteps.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleStartLab}>
                  Launch Lab Environment
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Download Resources
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleShowGrading}
                >
                  Grade Submissions
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Join Study Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showGrading && (
        <div className="fixed inset-0 bg-white z-50">
          <GradingInterface
            submissions={submissions}
            onGradeSubmission={handleGradeSubmission}
            onClose={() => setShowGrading(false)}
          />
        </div>
      )}
    </div>
  );
}
