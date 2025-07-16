import { Badge } from "@clnt/components/ui/badge.tsx";
import { Button } from "@clnt/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import {
  Clock,
  Users,
  BookOpen,
  Play,
  ChevronLeftCircleIcon,
} from "lucide-react";
import type { Progress, Project } from "@clnt/types/project";
import fallBackImg from "src/client/assets/projects/7df2a902-d302-44ab-934d-abcd290ae2a1.jpg";
import moment from "moment";

interface ProjectHeaderProps {
  project: Project;
  progress: Progress;
  onStartLab: () => void;
  onExitLab: () => void;
}

export function ProjectHeader({
  project,
  progress,
  onStartLab,
  onExitLab,
}: ProjectHeaderProps) {
  const formatDuration = (duration: Date | null) => {
    if (!duration) return "Self-paced";
    return moment(duration).format("LLLL");
    /* return `${hours} hours`; */
  };

  const getTagColor = (tag: string) => {
    const colors = {
      NETWORKING: "bg-blue-100 text-blue-800",
      CYBERSECURITY: "bg-red-100 text-red-800",
    };
    return colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  const images = import.meta.glob("@clnt/assets/projects/*.{jpg,png}", {
    eager: true,
  });

  function resolveImagePath(dbPath: string | null | undefined): string {
    if (!dbPath) return "/fallback.jpg";

    // Remove leading slash if present
    const normalized = dbPath.startsWith("/") ? dbPath.slice(1) : dbPath;

    const mod = images[normalized];
    if (mod) {
      return (mod as { default: string }).default;
    }

    return "/fallback.jpg";
  }

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {project.imageUrl && (
          <img
            src={resolveImagePath(project?.imageUrl)}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Project Info Overlay */}
      <div className="absolute top-10 left-15 right-0 text-white">
        <Button variant={"ghost"} onClick={onExitLab} size="lg">
          <ChevronLeftCircleIcon className="h-12 w-12 mr-2" />
          Exit Lab
        </Button>
      </div>
      <div className="absolute bottom-10 left-0 right-0 p-6  text-white">
        <div className="container mx-auto">
          <div className="flex items-end gap-4">
            <Avatar className="h-16 w-16 border-4 border-white">
              <AvatarImage src={resolveImagePath(project?.imageUrl)} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {project.projectName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Until {formatDuration(project.duration)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.classrooms?.[0]?._count?.students ?? 0} enrolled
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Updated {moment(project.updatedAt).format("LL")}
                </div>
              </div>
            </div>
            <Button
              onClick={onStartLab}
              variant={"link"}
              size="lg"
              className="bg-white text-black hover:bg-gray-300"
            >
              <Play className="h-4 w-4 mr-2" />
              {progress.status === "IN_PROGRESS"
                ? "Continue"
                : progress.status === "COMPLETED"
                  ? "Restart"
                  : "Start"}{" "}
              Lab
            </Button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="container mx-auto px-6 pt-4">
        <div className="flex gap-2">
          {project.tags && (
            <Badge className={getTagColor(project.tags)}>
              {project.tags.replace("_", " ")}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
