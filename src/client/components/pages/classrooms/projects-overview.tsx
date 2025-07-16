"use client";

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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { BookOpen, Clock, Play, Calendar } from "lucide-react";
import type { ClassroomProgress } from "@clnt/types/classroom";
import type { Project } from "@clnt/types/project";

interface ProjectsOverviewProps {
  projects: Project[];
  progress: ClassroomProgress[];
  onViewProject: (project: Project) => void;
  onAssignProject: () => void;
}

export function ProjectsOverview({
  projects,
  progress,
  onViewProject,
  onAssignProject,
}: ProjectsOverviewProps) {
  const getProjectProgress = (projectId: string) => {
    const projectProgress = progress.filter((p) => p.projectId === projectId);
    if (projectProgress.length === 0)
      return { completed: 0, total: 0, percentage: 0, inProgress: 0 };

    const completed = projectProgress.filter(
      (p) => p.status === "COMPLETED",
    ).length;
    const inProgress = projectProgress.filter(
      (p) => p.status === "IN_PROGRESS",
    ).length;
    const total = projectProgress.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage, inProgress };
  };

  const getDifficultyColor = (tags: string | null) => {
    if (!tags) return "bg-gray-100 text-gray-800";

    const colors = {
      NETWORKING: "bg-blue-100 text-blue-800",
      SECURITY: "bg-red-100 text-red-800",
      CLOUD: "bg-purple-100 text-purple-800",
      PROGRAMMING: "bg-green-100 text-green-800",
      DATABASE: "bg-yellow-100 text-yellow-800",
    };
    return colors[tags as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDuration = (duration: Date | null) => {
    if (!duration) return "Self-paced";
    const hours = duration.getHours();
    return `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Assigned Projects</h2>
        <Button onClick={onAssignProject}>
          <BookOpen className="h-4 w-4 mr-2" />
          Assign Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects assigned</h3>
            <p className="text-muted-foreground mb-4">
              Assign projects to give your students hands-on learning
              experiences
            </p>
            <Button onClick={onAssignProject}>
              <BookOpen className="h-4 w-4 mr-2" />
              Assign First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => {
            const projectProgress = getProjectProgress(project.id);

            return (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={project.imageUrl || undefined} />
                        <AvatarFallback>
                          <BookOpen className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">
                            {project.projectName}
                          </CardTitle>
                          {project.tags && (
                            <Badge className={getDifficultyColor(project.tags)}>
                              {project.tags.replace("_", " ")}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.projectDescription ||
                            "No description available"}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(project.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Updated{" "}
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={() => onViewProject(project)} size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Overview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Class Progress</span>
                        <span className="font-medium">
                          {projectProgress.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={projectProgress.percentage}
                        className="h-2"
                      />
                    </div>

                    {/* Student Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {projectProgress.completed}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Completed
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-yellow-600">
                          {projectProgress.inProgress}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          In Progress
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-600">
                          {projectProgress.total -
                            projectProgress.completed -
                            projectProgress.inProgress}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Not Started
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
