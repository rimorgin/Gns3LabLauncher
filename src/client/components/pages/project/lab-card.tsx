import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import { Clock, Target, Play } from "lucide-react";
import { Lab } from "@clnt/types/lab";
import { NavLink } from "react-router";

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: Lab["difficulty"]) => {
  switch (difficulty) {
    case "BEGINNER":
      return "bg-green-500 text-white";
    case "INTERMEDIATE":
      return "bg-yellow-500 text-white";
    case "ADVANCED":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Helper function to format duration
const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ""}`;
};

export default function LabCard({ lab }: { lab: Lab }) {
  // Only show published labs
  if (lab.status === "DRAFT") {
    return null;
  }

  return (
    <Card key={lab.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{lab.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {lab.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getDifficultyColor(lab.difficulty)}>
              {lab.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Lab Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(lab.estimatedTime)}
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {lab.objectives.length} objectives
            </div>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {lab.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {lab.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{lab.tags.length - 3}
              </Badge>
            )}
          </div>
          {/* Actions */}
          <div className="w-full flex justify-end gap-5 bottom-0">
            <Button>
              <NavLink to={`labs/${lab.id}`} className="flex items-center">
                <Play className="h-4 w-4 mr-2" /> Launch Lab
              </NavLink>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
