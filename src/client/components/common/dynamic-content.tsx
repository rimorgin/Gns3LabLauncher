import LoadingContent from "@clnt/components/contents/loading-content";
import { Suspense, lazy } from "react";
import { prismaStudioUrl } from "@clnt/constants/api";
import { useSidebarStore } from "@clnt/lib/store/sidebar-store";
import CoursesContent from "../contents/courses-content";
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
const ClassroomsContent = lazy(
  () => import("@clnt/components/contents/classrooms-content"),
);
const ProjectsContent = lazy(
  () => import("@clnt/components/contents/projects-content"),
);
const CalendarContent = lazy(
  () => import("@clnt/components/contents/calendar-content"),
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
