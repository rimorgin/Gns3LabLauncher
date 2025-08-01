import LoadingContent from "@clnt/components/contents/loading-content";
import { Suspense, lazy } from "react";
import { prismaStudioUrl } from "@clnt/constants/api";
import { useSidebarStore } from "@clnt/lib/store/sidebar-store";
import CompletionsContent from "../contents/completions-content";

// Lazy imports
const DashboardContent = lazy(
  () => import("@clnt/components/contents/dashboard-content"),
);
const UsersContent = lazy(
  () => import("@clnt/components/contents/users-content"),
);
const UserGroupsContent = lazy(
  () => import("@clnt/components/contents/user-groups-content"),
);

const CoursesContent = lazy(
  () => import("@clnt/components/contents/courses-content"),
);

const ClassroomsContent = lazy(
  () => import("@clnt/components/contents/classrooms-content"),
);
const ProjectsContent = lazy(
  () => import("@clnt/components/contents/projects-content"),
);

const LabsLibraryContent = lazy(
  () => import("@clnt/components/contents/labs-library-content"),
);

const LabsPlaygroundContent = lazy(
  () => import("@clnt/components/contents/labs-playground-content"),
);

const LabInstancesContent = lazy(
  () => import("@clnt/components/contents/lab-instances-content"),
);

const CalendarContent = lazy(
  () => import("@clnt/components/contents/calendar-content"),
);

const SystemHealthContent = lazy(
  () => import("@clnt/components/contents/system-health-content"),
);

const SystemLogsContent = lazy(
  () => import("@clnt/components/contents/system-logs-content"),
);

const AccountContent = lazy(
  () => import("@clnt/components/contents/account-content"),
);

export default function DynamicContent() {
  const activeNavName = useSidebarStore((state) => state.activeNavName);

  const renderContent = () => {
    switch (activeNavName) {
      case "Dashboard":
        return <DashboardContent />;
      case "Users":
        return <UsersContent />;
      case "User Groups":
        return <UserGroupsContent />;
      case "Classroom":
        return <ClassroomsContent />;
      case "Course":
        return <CoursesContent />;
      case "Projects":
        return <ProjectsContent />;
      case "Labs Library":
        return <LabsLibraryContent />;
      case "Labs Playground":
        return <LabsPlaygroundContent />;
      case "Lab Instances":
        return <LabInstancesContent />;
      case "Completions":
        return <CompletionsContent />;
      case "Calendar":
        return <CalendarContent />;
      case "Data Library": {
        return (
          <iframe
            id="studio-iframe"
            src={prismaStudioUrl}
            className="rounded-lg w-full h-full bg-background text-foreground"
            title="Data Library"
          />
        );
      }
      case "System Health":
        return <SystemHealthContent />;
      case "System Logs":
        return <SystemLogsContent />;
      case "Account":
        return <AccountContent />;
      default:
        return (
          <div className="px-4 lg:px-6 text-muted-foreground">
            <p>
              No content found for <strong>{activeNavName}</strong>
            </p>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<LoadingContent />}>
      <div className="w-full h-full p-4 lg:p-6">{renderContent()}</div>
    </Suspense>
  );
}
