"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { BookOpen, Clock, Play, Calendar } from "lucide-react";
import type { Project } from "@clnt/types/project";
import moment from "moment";

interface ProjectsOverviewProps {
  projects: Project[];
  onViewProject: (project: Project) => void;
}

export function ProjectsOverview({
  projects,
  onViewProject,
}: ProjectsOverviewProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between w-full mt-2">
        <h2 className="text-xl font-semibold">Assigned Projects</h2>
      </div>

      {!projects || projects?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects assigned</h3>
            <p className="text-muted-foreground mb-4">
              Assign projects to give your students hands-on learning
              experiences
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => {
            return (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-50 w-50 rounded-lg">
                        <AvatarImage
                          src={
                            project.imageUrl ??
                            "http://localhost:5000/static/images/projects/6c78003d-dbea-402d-99f2-9aac39e8ebb4.jpg"
                          }
                        />
                        <AvatarFallback>
                          <BookOpen className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">
                            {project.projectName}
                          </CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.projectDescription ||
                            "No description available"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Duration {moment(project.duration).format("LLL")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Updated {moment(project.updatedAt).format("LLL")}
                          </div>
                        </div>
                        <div className="mt-5">
                          {project.tags && (
                            <Badge className={getDifficultyColor(project.tags)}>
                              {project.tags.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      className="cursor-pointer"
                      onClick={() => onViewProject(project)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
