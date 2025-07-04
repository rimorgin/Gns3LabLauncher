import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import LoadingContent from "@clnt/components/contents/loading-content";
import { Suspense, lazy } from "react";
import { prismaStudioUrl } from "@clnt/constants/api";

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
  const { activeNavName } = useAppStateStore();

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
      case "Projects":
        return <ProjectsContent />;
      case "Reports":
        return (
          <div className="px-4 lg:px-6 text-muted-foreground">
            <h2 className="text-lg font-semibold">Reports View</h2>
            {/* Replace with your report view */}
          </div>
        );
      case "Calendar":
        return <CalendarContent />;
      case "Data Library":
        return (
          <iframe
            src={prismaStudioUrl}
            className="rounded-lg w-full h-full"
            title="Data Library"
          />
        );
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
