import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLoadingContent,
} from "@clnt/components/ui/sidebar";
import { data } from "@clnt/constants/data";
import RBACWrapper from "./rbac-wrapper";
import { useUser } from "@clnt/lib/auth";
import { RoleName } from "@clnt/types/roles-permissions-types";

const NavMain = React.lazy(() => import("@clnt/components/common/nav-main"));
const NavUser = React.lazy(() => import("@clnt/components/common/nav-user"));
const NavSecondary = React.lazy(
  () => import("@clnt/components/common/nav-secondary"),
);
const NavSystem = React.lazy(
  () => import("@clnt/components/common/nav-system"),
);
const NavReports = React.lazy(
  () => import("@clnt/components/common//nav-reports"),
);

export function getFilteredNavItems(role: RoleName) {
  const allowed = new Set(data.navItemsByRole[role] ?? []);

  const filterSection = (section: Array<{ title: string }>) =>
    section.filter((item) => allowed.has(item.title));

  return {
    main: filterSection(data.nav.main),
    reports: filterSection(data.nav.reports),
    system: filterSection(data.nav.system),
    secondary: data.nav.secondary,
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();
  const navItems = getFilteredNavItems(user.data?.role ?? "student");

  return (
    <React.Suspense fallback={<SidebarMenuLoadingContent />}>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5 text-center"
              >
                <a href="#">
                  <span className="text-2xl font-semibold text-center">
                    Gns3Lab
                    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-(--primary) to-(--success)">
                      Launcher
                    </span>
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain
            items={navItems.main}
            role={user.data?.role ?? "instructor"}
          />
          <NavReports items={navItems.reports} />

          <RBACWrapper
            requiredRoles="administrator"
            requiredPermissions={[
              "read_data_library",
              "read_system_health",
              "read_system_logs",
            ]}
          >
            <NavSystem items={navItems.system} />
          </RBACWrapper>

          <NavSecondary items={navItems.secondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user.data} />
        </SidebarFooter>
      </Sidebar>
    </React.Suspense>
  );
}
