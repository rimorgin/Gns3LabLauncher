"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { CheckCircle, Award, Clock, TrendingUp, UserPlus } from "lucide-react";
import type { ClassroomProgress, Student } from "@clnt/types/classroom";

interface ActivityItem {
  id: string;
  type: "completion" | "enrollment" | "progress" | "achievement";
  student: Student;
  projectName?: string;
  timestamp: Date;
  details?: string;
}

interface ActivityFeedProps {
  progress: ClassroomProgress[];
  students: Student[];
}

export function ActivityFeed({ progress, students }: ActivityFeedProps) {
  // Generate mock activity data based on progress and students
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add recent completions
    progress
      .filter((p) => p.status === "COMPLETED")
      .sort(
        (a, b) =>
          new Date(b.lastAccessedAt).getTime() -
          new Date(a.lastAccessedAt).getTime(),
      )
      .slice(0, 5)
      .forEach((p) => {
        activities.push({
          id: `completion_${p.studentId}_${p.projectId}`,
          type: "completion",
          student: p.student,
          projectName: p.project.projectName,
          timestamp: p.lastAccessedAt,
          details: `Completed ${p.project.projectName}`,
        });
      });

    // Add recent enrollments
    students
      .sort(
        (a, b) =>
          new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
      )
      .slice(0, 3)
      .forEach((student) => {
        activities.push({
          id: `enrollment_${student.userId}`,
          type: "enrollment",
          student,
          timestamp: student.enrolledAt,
          details: "Joined the classroom",
        });
      });

    // Add progress updates
    progress
      .filter((p) => p.status === "IN_PROGRESS")
      .sort(
        (a, b) =>
          new Date(b.lastAccessedAt).getTime() -
          new Date(a.lastAccessedAt).getTime(),
      )
      .slice(0, 3)
      .forEach((p) => {
        activities.push({
          id: `progress_${p.studentId}_${p.projectId}`,
          type: "progress",
          student: p.student,
          projectName: p.project.projectName,
          timestamp: p.lastAccessedAt,
          details: `Made progress on ${p.project.projectName} (${Math.round((p.completedSteps / p.totalSteps) * 100)}%)`,
        });
      });

    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);
  };

  const activities = generateActivities();

  const getActivityIcon = (type: ActivityItem["type"]) => {
    const icons = {
      completion: CheckCircle,
      enrollment: UserPlus,
      progress: TrendingUp,
      achievement: Award,
    };
    return icons[type];
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    const colors = {
      completion: "text-green-600",
      enrollment: "text-blue-600",
      progress: "text-yellow-600",
      achievement: "text-purple-600",
    };
    return colors[type];
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No recent activity</h3>
            <p className="text-muted-foreground">
              Student activity will appear here as they engage with projects
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={activity.student.profileImage || undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(
                            activity.student.firstName,
                            activity.student.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {activity.student.firstName} {activity.student.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
