"use client";

import { useState } from "react";
import { ClassroomHeader } from "@clnt/components/pages/classrooms/classroom-header";
import { StudentsList } from "@clnt/components/pages/classrooms/students-list";
import { ProjectsOverview } from "@clnt/components/pages/classrooms/projects-overview";
import { ActivityFeed } from "@clnt/components/pages/classrooms/activity-feed";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import { Users, BookOpen, TrendingUp, Award } from "lucide-react";
import type {
  Classroom,
  ClassroomProgress,
  Student,
} from "@clnt/types/classroom";
import type { Project, ProjectTagsEnum } from "@clnt/types/project";
import { ClassroomStatusEnum } from "@clnt/types/classroom";
import router from "../route-layout";

// Mock data - replace with actual API calls
const mockClassroom: Classroom = {
  id: "classroom_1",
  classroomName: "Advanced Network Security - Fall 2024",
  status: "ACTIVE" as ClassroomStatusEnum,
  courseId: "course_1",
  instructorId: "instructor_1",
  imageUrl: "/placeholder.svg?height=400&width=800",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
  course: {
    id: "course_1",
    courseName: "Network Security Fundamentals",
    description:
      "Comprehensive course on network security principles and practices",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  instructor: {
    userId: "instructor_1",
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@university.edu",
    profileImage: "/placeholder.svg?height=100&width=100",
  },
  studentGroups: [
    {
      id: "group_1",
      groupName: "Team Alpha",
      description: "Advanced students group",
      createdAt: new Date("2024-01-20"),
      students: [],
    },
  ],
  projects: [
    {
      id: "project_1",
      projectName: "GNS3 Network Simulation Mastery",
      projectDescription:
        "Master network simulation with GNS3 - From beginner to advanced networking concepts",
      imageUrl: "/placeholder.svg?height=200&width=300",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      visible: true,
      duration: new Date(2024, 0, 1, 40, 0),
      tags: "NETWORKING" as ProjectTagsEnum,
      progresses: [],
      classrooms: [],
      submissions: [],
    },
    {
      id: "project_2",
      projectName: "Network Security Lab",
      projectDescription:
        "Hands-on security testing and vulnerability assessment",
      imageUrl: "/placeholder.svg?height=200&width=300",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
      visible: true,
      duration: new Date(2024, 0, 1, 25, 0),
      tags: "SECURITY" as ProjectTagsEnum,
      progresses: [],
      classrooms: [],
      submissions: [],
    },
  ],
  students: [
    {
      userId: "student_1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@student.edu",
      profileImage: "/placeholder.svg?height=100&width=100",
      enrolledAt: new Date("2024-01-16"),
    },
    {
      userId: "student_2",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@student.edu",
      profileImage: "/placeholder.svg?height=100&width=100",
      enrolledAt: new Date("2024-01-17"),
    },
    {
      userId: "student_3",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@student.edu",
      profileImage: null,
      enrolledAt: new Date("2024-01-18"),
    },
  ],
  progress: [
    {
      studentId: "student_1",
      projectId: "project_1",
      completedSteps: 8,
      totalSteps: 10,
      status: "IN_PROGRESS" as ClassroomProgress["status"],
      lastAccessedAt: new Date("2024-01-19"),
      student: {
        userId: "student_1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@student.edu",
        profileImage: "/placeholder.svg?height=100&width=100",
        enrolledAt: new Date("2024-01-16"),
      },
      project: {
        id: "project_1",
        projectName: "GNS3 Network Simulation Mastery",
        projectDescription: "Master network simulation with GNS3",
        imageUrl: "/placeholder.svg?height=200&width=300",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        visible: true,
        duration: new Date(2024, 0, 1, 40, 0),
        tags: "NETWORKING" as ProjectTagsEnum,
        progresses: [],
        classrooms: [],
        submissions: [],
      },
    },
    {
      studentId: "student_2",
      projectId: "project_1",
      completedSteps: 10,
      totalSteps: 10,
      status: "COMPLETED" as ClassroomProgress["status"],
      lastAccessedAt: new Date("2024-01-20"),
      student: {
        userId: "student_2",
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@student.edu",
        profileImage: "/placeholder.svg?height=100&width=100",
        enrolledAt: new Date("2024-01-17"),
      },
      project: {
        id: "project_1",
        projectName: "GNS3 Network Simulation Mastery",
        projectDescription: "Master network simulation with GNS3",
        imageUrl: "/placeholder.svg?height=200&width=300",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        visible: true,
        duration: new Date(2024, 0, 1, 40, 0),
        tags: "NETWORKING" as ProjectTagsEnum,
        progresses: [],
        classrooms: [],
        submissions: [],
      },
    },
  ],
};

export default function ClassroomPageRoute() {
  const [classroom] = useState<Classroom>(mockClassroom);

  const handleViewStudent = (student: Student) => {
    console.log("View student profile:", student);
    // Navigate to student profile
  };

  const handleMessageStudent = (student: Student) => {
    console.log("Message student:", student);
    // Open messaging interface
  };

  const handleRemoveStudent = (studentId: string) => {
    console.log("Remove student:", studentId);
    // Implement remove student functionality
  };

  const handleViewProject = (project: Project) => {
    console.log("View project:", project);
    // Navigate to project page
  };

  const handleAssignProject = () => {
    console.log("Assign new project");
    // Open project assignment interface
  };

  const handleExitClassroom = () => {
    router.navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <ClassroomHeader
        classroom={classroom}
        onExitClassroom={handleExitClassroom}
      />

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProjectsOverview
                  projects={classroom.projects}
                  progress={classroom.progress}
                  onViewProject={handleViewProject}
                  onAssignProject={handleAssignProject}
                />
              </div>

              <div className="space-y-6">
                <ActivityFeed
                  progress={classroom.progress}
                  students={classroom.students}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentsList
              students={classroom.students}
              progress={classroom.progress}
              onViewStudent={handleViewStudent}
              onMessageStudent={handleMessageStudent}
              onRemoveStudent={handleRemoveStudent}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsOverview
              projects={classroom.projects}
              progress={classroom.progress}
              onViewProject={handleViewProject}
              onAssignProject={handleAssignProject}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {classroom.students.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active enrollments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {classroom.projects.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigned projects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      classroom.progress.filter((p) => p.status === "COMPLETED")
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Projects completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Avg. Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (classroom.progress.filter(
                        (p) => p.status === "COMPLETED",
                      ).length /
                        Math.max(classroom.progress.length, 1)) *
                        100,
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Class average</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classroom.projects.map((project) => {
                    const projectProgress = classroom.progress.filter(
                      (p) => p.projectId === project.id,
                    );
                    const completed = projectProgress.filter(
                      (p) => p.status === "COMPLETED",
                    ).length;
                    const total = projectProgress.length;
                    const percentage =
                      total > 0 ? Math.round((completed / total) * 100) : 0;

                    return (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {project.projectName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {completed}/{total} completed ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
