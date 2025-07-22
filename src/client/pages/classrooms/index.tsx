"use client";

import { ClassroomHeader } from "@clnt/components/pages/classrooms/classroom-header";
import { StudentsList } from "@clnt/components/pages/classrooms/students-list";
import { ProjectsOverview } from "@clnt/components/pages/classrooms/projects-overview";
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
import { Users, BookOpen } from "lucide-react";
import type { Student, UserGroups } from "@clnt/types/classroom";
import type { Project } from "@clnt/types/project";
import router from "../route-layout";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import Loader from "@clnt/components/common/loader";
import { Navigate, Outlet, useParams } from "react-router";
import { StudentGroupView } from "@clnt/components/pages/classrooms/student-group-view";
import ClassroomOverview from "@clnt/components/pages/classrooms/classroom-overview";
import { useUser } from "@clnt/lib/auth";
import PageMeta from "@clnt/components/common/page-meta";

export default function ClassroomPageRoute() {
  const params = useParams();
  const classroomId = params.classroomId;
  const user = useUser();
  const {
    data: classroomQry,
    isLoading,
    isError,
  } = useClassroomsQuery({
    by_id: classroomId,
    includes: ["course", "students", "instructor", "projects", "studentGroups"],
  });

  const [classroom] = classroomQry ?? [];
  console.log("🚀 ~ ClassroomPageRoute ~ classroom:", classroom);

  if (isLoading) return <Loader />;
  if (isError || !classroom || !user.data)
    return <Navigate to={"/errorPage"} />;

  const handleViewStudent = (student: Student) => {
    console.log("View student profile:", student);
    // Navigate to student profile
  };

  const handleMessageStudent = (student: Student) => {
    console.log("Message student:", student);
    // Open messaging interface
  };

  const handleViewProject = (project: Project) => {
    router.navigate(`project/${project.id}`);
    // Navigate to project page
  };

  const handleJoinGroup = (group: UserGroups) => {
    console.log("Joining", group);
  };

  const handleExitClassroom = () => {
    router.navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Classrooms" description="Classrooms viewer page route" />
      {/* RENDER CHILD PATHS USING OUTLET */}
      <Outlet />
      {/* RENDER CHILD PATHS USING OUTLET */}
      <ClassroomHeader
        classroom={classroom}
        onExitClassroom={handleExitClassroom}
      />

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="student-groups">Groups</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ClassroomOverview classroom={classroom} />
          </TabsContent>

          <TabsContent value="students">
            <StudentsList
              students={classroom.students}
              onViewStudent={handleViewStudent}
              onMessageStudent={handleMessageStudent}
            />
          </TabsContent>
          <TabsContent value="student-groups">
            <StudentGroupView
              currentUserId={user.data?.id}
              classroomId={classroom.id}
              studentGroups={classroom.studentGroups}
              onJoinGroup={handleJoinGroup}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsOverview
              projects={classroom.projects}
              onViewProject={handleViewProject}
            />
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <Card className="">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classroom.students?.length}
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
                <div className="text-2xl font-bold text-accent-foreground">
                  {classroom.projects?.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Assigned projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
