"use client";

import { Badge } from "@clnt/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { Card, CardContent } from "@clnt/components/ui/card";
import {
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  ChevronLeftCircleIcon,
} from "lucide-react";
import type { Classroom } from "@clnt/types/classroom";
import { Button } from "@clnt/components/ui/button";

interface ClassroomHeaderProps {
  classroom: Classroom;
  onExitClassroom: () => void;
}

export function ClassroomHeader({
  classroom,
  onExitClassroom,
}: ClassroomHeaderProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-yellow-100 text-yellow-800",
      ARCHIVED: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="h-58 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {classroom.imageUrl && (
          <img
            src={classroom.imageUrl || "/placeholder.svg"}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Classroom Info Overlay */}
      <div className="absolute top-10 left-15 right-0 text-white">
        <Button variant={"ghost"} onClick={onExitClassroom} size="lg">
          <ChevronLeftCircleIcon className="h-12 w-12 mr-2" />
          Exit Classroom
        </Button>
      </div>
      <div className="absolute top-24 left-0 right-0 p-6 text-white">
        <div className="container mx-auto">
          <div className="flex items-end gap-6">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={classroom.imageUrl || undefined} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                <GraduationCap className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {classroom.classroomName}
                </h1>
                <Badge className={getStatusColor(classroom.status)}>
                  {classroom.status}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm opacity-90">
                {classroom.course && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {classroom.course.courseName}
                  </div>
                )}

                {classroom.instructor && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {classroom.instructor.firstName}{" "}
                    {classroom.instructor.lastName}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(classroom.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-6 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {classroom.students.length}
              </div>
              <div className="text-sm text-muted-foreground">Students</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {classroom.projects.length}
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {classroom.studentGroups.length}
              </div>
              <div className="text-sm text-muted-foreground">Groups</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(
                  (classroom.progress.filter((p) => p.status === "COMPLETED")
                    .length /
                    Math.max(classroom.progress.length, 1)) *
                    100,
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">Avg. Progress</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
