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
import type { Student, UserGroups } from "@clnt/types/classroom";
import type { Project } from "@clnt/types/project";
import router from "../route-layout";
import { useClassroomsQuery } from "@clnt/lib/queries/classrooms-query";
import Loader from "@clnt/components/common/loader";
import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { StudentGroupView } from "@clnt/components/pages/classrooms/student-group-view";
import ClassroomOverview from "@clnt/components/pages/classrooms/classroom-overview";
import { useUser } from "@clnt/lib/auth";
import PageMeta from "@clnt/components/common/page-meta";
import { LabSubmissionsOverview } from "@clnt/components/pages/classrooms/submissions-overview";
import { useState } from "react";
import { LabSubmissionGradingDrawer } from "@clnt/components/pages/classrooms/submissions-grading-drawer";
import type { LabSubmission, LabSubmissionFile } from "@clnt/types/submission";
import type { Lab } from "@clnt/types/lab";
import { useLabSubmissionsQuery } from "@clnt/lib/queries/lab-submission-query";
import { useGradeLab } from "@clnt/lib/mutations/lab/lab-submission-update-mutation";
import { toast } from "sonner";

export default function ClassroomPageRoute() {
  const location = useLocation();
  const { classroomId } = useParams();
  const [selectedLabSubmission, setSelectedLabSubmission] =
    useState<LabSubmission | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isLabGradingDrawerOpen, setIsLabGradingDrawerOpen] = useState(false);
  const isBaseClassroomPage =
    location.pathname === `/classrooms/${classroomId}`;
  const user = useUser();
  const {
    data: classroomQry,
    isLoading: isClassroomLoading,
    isError: isClassroomError,
  } = useClassroomsQuery({
    by_id: classroomId,
    includes: ["course", "students", "instructor", "projects", "studentGroups"],
  });

  const {
    data: labSubmissionsQry,
    isLoading: isLabSubmissionLoading,
    isError: isLabSubmissionError,
  } = useLabSubmissionsQuery({
    classroomId,
    studentId: user.data?.role === "student" ? user.data.id : undefined,
  });

  const { mutateAsync } = useGradeLab();

  const [classroom] = classroomQry ?? [];
  const submissions = labSubmissionsQry?.submissions ?? [];
  const labs = labSubmissionsQry?.labs ?? [];

  /* const {
    data: classroomLabSubmissions
  }  */

  if (isClassroomLoading || isLabSubmissionLoading) return <Loader />;
  if (isClassroomError || isLabSubmissionError || !classroom || !user.data)
    return <Navigate to={"/errorPage"} />;

  const handleViewStudent = (student: Student) => {
    console.log("viewing student:", student);
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

  const handleViewLabSubmission = (submission: LabSubmission) => {
    setSelectedLabSubmission(submission);
    setSelectedLab(labs.find((lab) => submission.labId === lab.id) || null);
    setIsLabGradingDrawerOpen(true);
  };

  const handleGradeLabSubmission = (submission: LabSubmission) => {
    setSelectedLabSubmission(submission);
    setSelectedLab(labs.find((lab) => submission.labId === lab.id) || null);
    setIsLabGradingDrawerOpen(true);
  };

  const handleDownloadLabSubmission = (submission: LabSubmission) => {
    console.log("Download lab submission:", submission);
    // Download all files or open them in new tabs
    submission.files.forEach((file: LabSubmissionFile) => {
      window.open(file.url, "_blank");
    });
  };

  const handleSaveLabGrade = async (
    submissionId: string,
    grade: number,
    feedback: string,
  ) => {
    toast.promise(
      mutateAsync({ submissionId, formData: { grade, feedback } }),
      {
        loading: "Grading lab submission",
        success: "Graded lab submission",
        error: "Error grading lab submission",
      },
    );
  };
  const handleExitClassroom = () => {
    router.navigate("/");
  };
  return (
    <div className="min-h-screen bg-background">
      {/* RENDER CHILD PATHS USING OUTLET */}
      {!isBaseClassroomPage ? (
        <Outlet />
      ) : (
        <>
          <PageMeta
            title="Classrooms"
            description="Classrooms viewer page route"
          />
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
                {/* <TabsTrigger value="discussions">Discussions</TabsTrigger> */}
                <TabsTrigger value="grades">Grades</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <ClassroomOverview
                  classroom={classroom}
                  submissions={submissions}
                  labs={labs}
                />
              </TabsContent>

              <TabsContent value="students">
                <StudentsList
                  currentUser={user.data}
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

              {/* <TabsContent value="discussions" className="space-y-6">
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
              </TabsContent> */}

              <TabsContent value="grades" className="space-y-6">
                <LabSubmissionsOverview
                  currentUser={user.data}
                  submissions={submissions}
                  projects={classroom.projects}
                  labs={labs}
                  students={classroom.students}
                  onViewSubmission={handleViewLabSubmission}
                  onGradeSubmission={handleGradeLabSubmission}
                  onDownloadSubmission={handleDownloadLabSubmission}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}

      <LabSubmissionGradingDrawer
        currentUser={user.data}
        lab={selectedLab}
        submission={selectedLabSubmission}
        isOpen={isLabGradingDrawerOpen}
        onClose={() => {
          setIsLabGradingDrawerOpen(false);
          setSelectedLabSubmission(null);
        }}
        onSaveGrade={handleSaveLabGrade}
      />
    </div>
  );
}
