import { Separator } from "@clnt/components/ui/separator";
import { SidebarTrigger } from "@clnt/components/ui/sidebar";
import ModeToggle from "./theme-toggle";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { Skeleton } from "@clnt/components/ui/skeleton";
import RBACWrapper from "./rbac-wrapper";
import React, { Suspense } from "react";

const LazyQuickCreate = React.lazy(() => import("./quick-create"));

export function SiteHeader() {
  const { activeNavName } = useAppStateStore();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Show skeleton until nav name loads */}
        <h1 className="text-base font-medium">
          {activeNavName || <Skeleton className="h-4 w-19" />}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <RBACWrapper
            requiredPermissions={["create_users", "create_classrooms"]}
            requiredRoles={["administrator", "instructor"]}
          >
            <Suspense fallback={<Skeleton className="h-9 w-31" />}>
              <LazyQuickCreate />
            </Suspense>

            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </RBACWrapper>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
