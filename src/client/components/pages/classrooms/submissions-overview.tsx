"use client";

import { useState } from "react";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Input } from "@clnt/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import {
  Clock,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  Star,
  FlaskConical,
} from "lucide-react";
import { Project } from "@clnt/types/project";
import { Lab } from "@clnt/types/lab";
import { Student } from "@clnt/types/student-types";
import { LabSubmission } from "@clnt/types/submission";
import { IUser } from "@clnt/types/auth-types";

interface LabSubmissionsOverviewProps {
  currentUser: IUser;
  submissions: LabSubmission[];
  projects: Project[];
  labs: Lab[];
  students: Student[];
  onViewSubmission: (submission: LabSubmission) => void;
  onGradeSubmission: (submission: LabSubmission) => void;
  onDownloadSubmission: (submission: LabSubmission) => void;
}

export function LabSubmissionsOverview({
  currentUser,
  submissions,
  projects,
  labs,
  onViewSubmission,
  onGradeSubmission,
  onDownloadSubmission,
}: LabSubmissionsOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [labFilter, setLabFilter] = useState("all");
  const [viewMode, setViewMode] = useState("all"); // all, by-lab, by-project

  const isStudent = currentUser.role === "student";

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "late":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.student.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.project.projectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.lab.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    const matchesProject =
      projectFilter === "all" || submission.projectId === projectFilter;
    const matchesLab = labFilter === "all" || submission.labId === labFilter;

    return matchesSearch && matchesStatus && matchesProject && matchesLab;
  });

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const lateCount = submissions.filter((s) => s.status === "late").length;
  const avgAttempts =
    submissions.length > 0
      ? Math.round(
          (submissions.reduce((sum, s) => sum + s.attempt, 0) /
            submissions.length) *
            10,
        ) / 10
      : 0;

  // Group submissions by lab or project for different views
  const groupedByLab = filteredSubmissions.reduce(
    (acc, submission) => {
      const labName = submission.lab.title;
      if (!acc[labName]) acc[labName] = [];
      acc[labName].push(submission);
      return acc;
    },
    {} as Record<string, LabSubmission[]>,
  );

  const groupedByProject = filteredSubmissions.reduce(
    (acc, submission) => {
      const projectName = submission.project.projectName;
      if (!acc[projectName]) acc[projectName] = [];
      acc[projectName].push(submission);
      return acc;
    },
    {} as Record<string, LabSubmission[]>,
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lab Submissions
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">Across all labs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">Needs grading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Late Submissions
            </CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lateCount}</div>
            <p className="text-xs text-muted-foreground">Submitted Late</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {gradedCount}
            </div>
            <p className="text-xs text-muted-foreground">Completed reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attempts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttempts}</div>
            <p className="text-xs text-muted-foreground">Per submission</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Modes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {isStudent ? "Your Lab Submissions" : "Lab Submissions"}
              </CardTitle>
              <CardDescription>
                {isStudent
                  ? "View your grades for your lab submissions across projects"
                  : "Manage and grade student lab submissions across projects"}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="by-lab">Group by Lab</SelectItem>
                  <SelectItem value="by-project">Group by Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Search (60%) */}
            <div className="relative w-full lg:w-[60%]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={
                  isStudent
                    ? "Search by project or lab..."
                    : "Search by student, project, or lab..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filters (40% total, equally spaced) */}
            <div className="w-full lg:w-[39%] flex gap-4">
              {/* Each filter takes 1/3 of the space */}
              <div className="flex-1">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={labFilter} onValueChange={setLabFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Lab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Labs</SelectItem>
                    {labs.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id}>
                        {lab.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Submissions</TabsTrigger>
              <TabsTrigger value="by-lab">By Lab</TabsTrigger>
              <TabsTrigger value="by-project">By Project</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead hidden={isStudent}>Student</TableHead>
                      <TableHead>Lab</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Attempt</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        {!isStudent && (
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      submission.student.user.avatar ||
                                      "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback>
                                    {submission.student.user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {submission.student.isOnline && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {submission.student.user.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {submission.student.user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {submission.lab.title}
                            </div>
                            {submission.lab.dueDate && (
                              <div className="text-sm text-muted-foreground">
                                Due:{" "}
                                {new Date(
                                  submission.lab.dueDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {submission.project.projectName}
                            </div>
                            {submission.project.tags && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {submission.project.tags}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {submission.submittedAt
                              ? new Date(
                                  submission.submittedAt,
                                ).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {submission.submittedAt
                              ? new Date(
                                  submission.submittedAt,
                                ).toLocaleTimeString()
                              : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {submission.grade !== undefined &&
                          submission.grade !== null ? (
                            <div className="font-medium">
                              {submission.grade}/{submission.lab.maxGrade}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Not graded
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            #{submission.attempt}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {isStudent ? (
                                <DropdownMenuItem
                                  onClick={() => onViewSubmission(submission)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Submission
                                </DropdownMenuItem>
                              ) : (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onGradeSubmission(submission)
                                    }
                                  >
                                    <Star className="mr-2 h-4 w-4" />
                                    Grade Submission
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onDownloadSubmission(submission)
                                    }
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Files
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="by-lab">
              <div className="space-y-6">
                {Object.entries(groupedByLab).map(
                  ([labName, labSubmissions]) => (
                    <Card key={labName}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FlaskConical className="h-5 w-5" />
                          {labName}
                          <Badge variant="secondary" className="ml-2">
                            {labSubmissions.length} submissions
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {labSubmissions.map((submission) => (
                            <Card
                              key={submission.id}
                              className="hover:shadow-md transition-shadow"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={
                                          submission.student.user.avatar ||
                                          "/placeholder.svg"
                                        }
                                      />
                                      <AvatarFallback className="text-xs">
                                        {submission.student.user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                      {submission.student.user.name}
                                    </span>
                                  </div>
                                  <Badge
                                    className={getStatusColor(
                                      submission.status,
                                    )}
                                    variant="secondary"
                                  >
                                    {submission.status || "pending"}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Project:
                                    </span>{" "}
                                    {submission.project.projectName}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Attempt:
                                    </span>{" "}
                                    #{submission.attempt}
                                  </div>
                                  {submission.grade !== undefined && (
                                    <div>
                                      <span className="text-muted-foreground">
                                        Grade:
                                      </span>{" "}
                                      {submission.grade}
                                      {/* /
                                      {submission.lab.maxGrade} */}
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2 mt-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => onViewSubmission(submission)}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    View Submission
                                  </Button>
                                  {!isStudent && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() =>
                                        onGradeSubmission(submission)
                                      }
                                    >
                                      <Star className="mr-1 h-3 w-3" />
                                      Grade
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="by-project">
              <div className="space-y-6">
                {Object.entries(groupedByProject).map(
                  ([projectName, projectSubmissions]) => (
                    <Card key={projectName}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {projectName}
                          <Badge variant="secondary" className="ml-2">
                            {projectSubmissions.length} submissions
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {projectSubmissions.map((submission) => (
                            <Card
                              key={submission.id}
                              className="hover:shadow-md transition-shadow"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={
                                          submission.student.user.avatar ||
                                          "/placeholder.svg"
                                        }
                                      />
                                      <AvatarFallback className="text-xs">
                                        {submission.student.user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                      {submission.student.user.name}
                                    </span>
                                  </div>
                                  <Badge
                                    className={getStatusColor(
                                      submission.status,
                                    )}
                                    variant="secondary"
                                  >
                                    {submission.status || "pending"}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Lab:
                                    </span>{" "}
                                    {submission.lab.title}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Attempt:
                                    </span>{" "}
                                    #{submission.attempt}
                                  </div>
                                  {submission.grade !== undefined && (
                                    <div>
                                      <span className="text-muted-foreground">
                                        Grade:
                                      </span>{" "}
                                      {submission.grade}/
                                      {submission.lab.maxGrade}
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2 mt-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => onViewSubmission(submission)}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    View Submission
                                  </Button>
                                  {!isStudent && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 bg-transparent"
                                      onClick={() =>
                                        onGradeSubmission(submission)
                                      }
                                    >
                                      <Star className="mr-1 h-3 w-3" />
                                      Grade
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <FlaskConical className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No lab submissions found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
