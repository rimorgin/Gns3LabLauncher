"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { Progress } from "@clnt/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Mail,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import type { Student, ClassroomProgress } from "@clnt/types/classroom";

interface StudentsListProps {
  students: Student[];
  progress: ClassroomProgress[];
  onViewStudent: (student: Student) => void;
  onMessageStudent: (student: Student) => void;
  onRemoveStudent: (studentId: string) => void;
}

export function StudentsList({
  students,
  progress,
  onViewStudent,
  onMessageStudent,
  onRemoveStudent,
}: StudentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStudentProgress = (studentId: string) => {
    const studentProgress = progress.filter((p) => p.studentId === studentId);
    if (studentProgress.length === 0)
      return { completed: 0, total: 0, percentage: 0 };

    const completed = studentProgress.filter(
      (p) => p.status === "COMPLETED",
    ).length;
    const total = studentProgress.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Students ({students.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "No students found" : "No students enrolled"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Students will appear here once they're added to the classroom"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const studentProgress = getStudentProgress(student.userId);
                const lastActive = progress
                  .filter((p) => p.studentId === student.userId)
                  .sort(
                    (a, b) =>
                      new Date(b.lastAccessedAt).getTime() -
                      new Date(a.lastAccessedAt).getTime(),
                  )[0];

                return (
                  <TableRow key={student.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={student.profileImage || undefined}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(student.firstName, student.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(student.enrolledAt)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={studentProgress.percentage}
                            className="flex-1 h-2"
                          />
                          <span
                            className={`text-sm font-medium ${getProgressColor(studentProgress.percentage)}`}
                          >
                            {studentProgress.percentage}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {studentProgress.completed}/{studentProgress.total}{" "}
                          projects
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {lastActive ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(lastActive.lastAccessedAt)}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Never
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewStudent(student)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onMessageStudent(student)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRemoveStudent(student.userId)}
                            className="text-red-600"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Remove from Class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
