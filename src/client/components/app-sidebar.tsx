import * as React from "react"
//import { NavDocuments } from "@clnt/components/nav-documents"
import { NavMain } from "@clnt/components/nav-main"
import { NavSecondary } from "@clnt/components/nav-secondary"
import { NavUser } from "@clnt/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@clnt/components/ui/sidebar"
import { data } from "@clnt/constants/data"
import { useUserStore } from "@clnt/lib/store/user-store"
import { NavSystem } from "./nav-system"
import { NavReports } from "./nav-reports"
import RBACWrapper from "./rbac-wrapper"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();
  return (
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
        <NavMain items={data.nav.main} />
        {/* <NavDocuments items={data.nav.documents} /> */}
        <RBACWrapper 
          requiredRoles={["instructor", "student"]}
        >
          <NavReports items={data.nav.reports} />
        </RBACWrapper>
        <RBACWrapper 
          requiredRoles="administrator"
          requiredPermissions={["read_data_library", "read_system_health", " read_system_logs"]}
        >
          <NavSystem items={data.nav.system} />
        </RBACWrapper>
        <NavSecondary items={data.nav.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
