/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, JSX } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import { Badge } from "@clnt/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Input } from "@clnt/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { Button } from "@clnt/components/ui/button";
import { Textarea } from "@clnt/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@clnt/components/ui/dialog";
import {
  BookOpen,
  Search,
  //Filter,
  Calendar,
  TrendingUp,
  Award,
  Target,
  FileText,
  Download,
  Eye,
  MessageSquare,
  //User,
  //Mail,
  //GraduationCap,
  //Activity,
  CheckCircle,
  PlayCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useUser } from "@clnt/lib/auth";
import { Navigate } from "react-router";
//import moment from "moment";
import { Classroom } from "@clnt/types/classroom";

// Helper functions
const createDataHelpers = (data: any) => {
  const studentInfo = data?.student || {};
  const classrooms = studentInfo.classrooms || [];
  const projectProgress = studentInfo.progress || [];
  const labProgress = studentInfo.labProgress || [];
  const labSubmissions = studentInfo.submissions || [];

  // Find project details helper
  const findProjectDetails = (projectId: string) => {
    for (const classroom of classrooms) {
      for (const project of classroom.projects || []) {
        if (project.id === projectId) {
          return {
            id: project.id,
            name: project.projectName || "Unknown Project",
            description: project.projectDescription || "",
            classroomName: classroom.classroomName || "",
            courseCode: classroom.course?.courseCode || "",
            courseName: classroom.course?.courseName || "",
          };
        }
      }
    }
    return {
      id: projectId,
      name: "Unknown Project",
      description: "",
      classroomName: "",
      courseCode: "",
      courseName: "",
    };
  };

  // Find lab details helper
  const findLabDetails = (labId: string) => {
    for (const classroom of classrooms) {
      for (const project of classroom.projects || []) {
        for (const lab of project.lab || []) {
          if (lab.id === labId) {
            return {
              id: lab.id,
              name: lab.title || "Unknown Lab",
              description: lab.description || "",
              projectName: project.projectName || "",
              classroomName: classroom.classroomName || "",
            };
          }
        }
      }
    }
    return {
      id: labId,
      name: "Unknown Lab",
      description: "",
      projectName: "",
      classroomName: "",
    };
  };

  // Find classroom details helper
  const findClassroomDetails = (classroomId: string) => {
    const classroom = classrooms.find((c: Classroom) => c.id === classroomId);
    return {
      id: classroomId,
      name: classroom?.classroomName || "Unknown Classroom",
      courseCode: classroom?.course?.courseCode || "",
      courseName: classroom?.course?.courseName || "",
    };
  };

  // Enhanced project data with details
  const getEnhancedProjects = () => {
    return projectProgress.map((project: any) => {
      const details = findProjectDetails(project.projectId);
      const classroom = findClassroomDetails(project.classroomId);
      return {
        ...project,
        projectName: details.name,
        projectDescription: details.description,
        classroomName: classroom.name,
        courseCode: classroom.courseCode,
        courseName: classroom.courseName,
      };
    });
  };

  // Enhanced lab data with details
  const getEnhancedLabs = () => {
    return labProgress.map((lab: any) => {
      const details = findLabDetails(lab.labId);
      // Find associated project progress to get project details
      const associatedProgress = projectProgress.find(
        (p: any) => p.id === lab.progressId,
      );
      const projectDetails = associatedProgress
        ? findProjectDetails(associatedProgress.projectId)
        : null;

      return {
        ...lab,
        labName: details.name,
        labDescription: details.description,
        projectName: projectDetails?.name || details.projectName,
        classroomName: details.classroomName,
        projectId: associatedProgress?.projectId || null,
      };
    });
  };

  // Enhanced submissions data with details
  const getEnhancedSubmissions = () => {
    return labSubmissions.map((submission: any) => {
      const labDetails = findLabDetails(submission.labId);
      const projectDetails = findProjectDetails(submission.projectId);

      return {
        ...submission,
        labName: labDetails.name,
        labDescription: labDetails.description,
        projectName: projectDetails.name,
        classroomName: projectDetails.classroomName,
        courseCode: projectDetails.courseCode,
      };
    });
  };

  // Statistics calculations
  const getStatistics = () => {
    const totalProjects = projectProgress.length;
    const completedProjects = projectProgress.filter(
      (p: any) => p.status === "COMPLETED",
    ).length;
    const totalLabs = labProgress.length;
    const completedLabs = labProgress.filter(
      (l: any) => l.status === "COMPLETED",
    ).length;
    const totalSubmissions = labSubmissions.length;
    const gradedSubmissions = labSubmissions.filter(
      (s: any) => s.grade !== null && s.grade !== undefined,
    );

    const averageGrade =
      gradedSubmissions.length > 0
        ? gradedSubmissions.reduce(
            (acc: number, s: any) => acc + (s.grade || 0),
            0,
          ) / gradedSubmissions.length
        : 0;

    const completionRate =
      totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    return {
      totalProjects,
      completedProjects,
      totalLabs,
      completedLabs,
      totalSubmissions,
      gradedSubmissions: gradedSubmissions.length,
      averageGrade,
      completionRate,
    };
  };

  return {
    findProjectDetails,
    findLabDetails,
    findClassroomDetails,
    getEnhancedProjects,
    getEnhancedLabs,
    getEnhancedSubmissions,
    getStatistics,
    rawData: {
      studentInfo,
      classrooms,
      projectProgress,
      labProgress,
      labSubmissions,
    },
  };
};

export default function StudentProgress() {
  const { data } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [feedbackText, setFeedbackText] = useState("");
  const [gradeValue, setGradeValue] = useState("");

  if (!data) return <Navigate to={"/errorPage"} />;

  // Create helpers with memoization for performance
  const helpers = useMemo(() => createDataHelpers(data), [data]);
  const statistics = useMemo(() => helpers.getStatistics(), [helpers]);
  const enhancedProjects = useMemo(
    () => helpers.getEnhancedProjects(),
    [helpers],
  );
  const enhancedLabs = useMemo(() => helpers.getEnhancedLabs(), [helpers]);
  const enhancedSubmissions = useMemo(
    () => helpers.getEnhancedSubmissions(),
    [helpers],
  );

  // Status helper functions
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      COMPLETED: "bg-green-500",
      GRADED: "bg-green-500",
      graded: "bg-green-500",
      IN_PROGRESS: "bg-blue-500",
      NOT_STARTED: "bg-gray-400",
      SUBMITTED: "bg-yellow-500",
      submitted: "bg-yellow-500",
      LATE: "bg-red-500",
    };
    return statusMap[status] || "bg-gray-400";
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, JSX.Element> = {
      COMPLETED: <CheckCircle className="w-4 h-4" />,
      GRADED: <CheckCircle className="w-4 h-4" />,
      graded: <CheckCircle className="w-4 h-4" />,
      IN_PROGRESS: <PlayCircle className="w-4 h-4" />,
      NOT_STARTED: <Clock className="w-4 h-4" />,
      SUBMITTED: <AlertCircle className="w-4 h-4" />,
      submitted: <AlertCircle className="w-4 h-4" />,
    };
    return iconMap[status] || <Clock className="w-4 h-4" />;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Improved filter functions with memoization
  const filteredProjects = useMemo(() => {
    return enhancedProjects.filter((project: any) => {
      const matchesSearch =
        !searchTerm ||
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.classroomName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enhancedProjects, searchTerm, statusFilter]);

  const filteredLabs = useMemo(() => {
    return enhancedLabs.filter((lab: any) => {
      const matchesSearch =
        !searchTerm ||
        lab.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.classroomName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lab.status === statusFilter;
      const matchesProject =
        projectFilter === "all" || lab.projectId === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [enhancedLabs, searchTerm, statusFilter, projectFilter]);

  const filteredSubmissions = useMemo(() => {
    return enhancedSubmissions.filter((submission: any) => {
      const matchesSearch =
        !searchTerm ||
        submission.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.projectName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.classroomName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;
      const matchesProject =
        projectFilter === "all" || submission.projectId === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [enhancedSubmissions, searchTerm, statusFilter, projectFilter]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    return enhancedSubmissions
      .sort(
        (a: any, b: any) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )
      .slice(0, 3);
  }, [enhancedSubmissions]);

  return (
    <div className="container space-y-6">
      {/* Student Header */}
      <div className="flex flex-col space-y-4">
        <p className="text-muted-foreground">
          Detailed view of student progress and submissions
        </p>

        {/* Student Profile Card */}
        {/* <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {data.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold">{data.name}</h3>
                  <Badge
                    variant={
                      helpers.rawData.studentInfo.isOnline
                        ? "default"
                        : "secondary"
                    }
                  >
                    {helpers.rawData.studentInfo.isOnline
                      ? "Online"
                      : "Offline"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>@{data.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">{data.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Last active:{" "}
                      {helpers.rawData.studentInfo.lastActiveAt
                        ? moment(
                            helpers.rawData.studentInfo.lastActiveAt,
                          ).format("LLL")
                        : "Never"}
                    </span>
                  </div>
                </div>
                {data.bio && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {data.bio}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.completedProjects}/{statistics.totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.completedLabs}/{statistics.totalLabs}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalSubmissions}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics.gradedSubmissions} graded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getGradeColor(statistics.averageGrade)}`}
            >
              {statistics.averageGrade.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {statistics.gradedSubmissions} submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.completionRate.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, labs, or submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="relative w-full flex flex-row">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full flex flex-row">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent className="w-full sm:w-fit flex flex-row">
            <SelectItem value="all">All Projects</SelectItem>
            {enhancedProjects.map((project: any) => (
              <SelectItem key={project.id} value={project.projectId}>
                {project.projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest progress and submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((submission: any) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(submission.status)}
                        <div>
                          <div className="font-medium">
                            {submission.labName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {submission.projectName} •{" "}
                            {new Date(
                              submission.submittedAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.grade !== null &&
                          submission.grade !== undefined && (
                            <Badge
                              variant="outline"
                              className={`font-mono ${getGradeColor(submission.grade)}`}
                            >
                              {submission.grade}%
                            </Badge>
                          )}
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No recent activity found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enhancedProjects.length > 0 ? (
                    enhancedProjects.map((project: any) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">
                            {project.projectName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {(project.percentComplete || 0).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={project.percentComplete || 0}
                          className="h-2"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No projects found
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enhancedSubmissions.filter(
                    (s: any) => s.grade !== null && s.grade !== undefined,
                  ).length > 0 ? (
                    enhancedSubmissions
                      .filter(
                        (s: any) => s.grade !== null && s.grade !== undefined,
                      )
                      .map((submission: any) => (
                        <div
                          key={submission.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm truncate">
                            {submission.labName}
                          </span>
                          <Badge
                            variant="outline"
                            className={`font-mono ${getGradeColor(submission.grade || 0)}`}
                          >
                            {submission.grade}%
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No graded submissions found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: any) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          {project.projectName}
                        </CardTitle>
                        <CardDescription>
                          {project.classroomName} • Created{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.projectDescription && (
                      <p className="text-sm text-muted-foreground">
                        {project.projectDescription}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {(project.percentComplete || 0).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={project.percentComplete || 0}
                        className="h-2"
                      />
                      {project.completedAt && (
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>
                            Completed{" "}
                            {new Date(project.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Started{" "}
                        {new Date(
                          project.startedAt || project.createdAt,
                        ).toLocaleDateString()}
                      </div>
                      <div>
                        Updated{" "}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    No projects found matching your filters
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          <div className="grid gap-4">
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab: any) => (
                <Card key={lab.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(lab.status)}
                          {lab.labName}
                        </CardTitle>
                        <CardDescription>{lab.labDescription}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(lab.status)}>
                        {lab.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{(lab.percentComplete || 0).toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={lab.percentComplete || 0}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">Sections</div>
                        <div className="text-muted-foreground">
                          {(lab.completedSections || []).length} completed
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Current: Section {lab.currentSection || 0}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Tasks</div>
                        <div className="text-muted-foreground">
                          {(lab.completedTasks || []).length} completed
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Verifications</div>
                        <div className="text-muted-foreground">
                          {(lab.completedVerifications || []).length} completed
                        </div>
                      </div>
                    </div>

                    {lab.startedAt && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Started {new Date(lab.startedAt).toLocaleDateString()}
                        </div>
                        {lab.completedAt && (
                          <div>
                            Completed{" "}
                            {new Date(lab.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    No labs found matching your filters
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="grid gap-4">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission: any) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(submission.status)}
                          {submission.labName}
                        </CardTitle>
                        <CardDescription>
                          {submission.projectName} • Attempt{" "}
                          {submission.attempt}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.grade !== null &&
                          submission.grade !== undefined && (
                            <Badge
                              variant="outline"
                              className={`font-mono ${getGradeColor(submission.grade)}`}
                            >
                              {submission.grade}%
                            </Badge>
                          )}
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Submitted{" "}
                      {new Date(submission.submittedAt).toLocaleString()}
                    </div>

                    {/* Files */}
                    {submission.files && submission.files.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium text-sm">
                          Submitted Files
                        </div>
                        <div className="space-y-2">
                          {submission.files.map((file: any) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {submission.feedback && (
                      <div className="space-y-2">
                        <div className="font-medium text-sm">Feedback</div>
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {submission.feedback}
                        </div>
                      </div>
                    )}

                    {/* Grading Actions (for ungraded submissions) */}
                    {submission.status === "SUBMITTED" && (
                      <div className="border-t pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Grade Submission
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Grade Submission</DialogTitle>
                              <DialogDescription>
                                Provide a grade and feedback for{" "}
                                {submission.labName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Grade (0-100)
                                </label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={gradeValue}
                                  onChange={(e) =>
                                    setGradeValue(e.target.value)
                                  }
                                  placeholder="Enter grade"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Feedback
                                </label>
                                <Textarea
                                  value={feedbackText}
                                  onChange={(e) =>
                                    setFeedbackText(e.target.value)
                                  }
                                  placeholder="Provide feedback to the student..."
                                  rows={4}
                                />
                              </div>
                              <Button
                                className="w-full"
                                onClick={() => {
                                  // Handle grade submission logic here
                                  console.log(
                                    "Submitting grade:",
                                    gradeValue,
                                    "Feedback:",
                                    feedbackText,
                                  );
                                  // Reset form
                                  setGradeValue("");
                                  setFeedbackText("");
                                }}
                              >
                                Submit Grade
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    No submissions found matching your filters
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
