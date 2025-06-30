import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarIcon,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@clnt/components/ui/sidebar";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import RBACWrapper from "./rbac-wrapper";

export default function NavMain({
  items,
}: {
  items: {
    title: string;
    icon?: Icon;
  }[];
}) {
  const { activeNavName, setActiveNavName } = useAppStateStore();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.title === activeNavName;

            const content = (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={
                    isActive
                      ? "bg-primary text-white hover:text-white hover:dark:bg-blue-900 hover:bg-primary/90"
                      : ""
                  }
                >
                  <button
                    onClick={() =>
                      isActive ? {} : setActiveNavName(item.title)
                    }
                  >
                    {item.icon && <SidebarIcon icon={item.icon} />}
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );

            if (item.title.toLowerCase() === "users") {
              return (
                <RBACWrapper
                  key={item.title}
                  requiredPermissions="read_users"
                  requiredRoles={["administrator", "instructor"]}
                >
                  {content}
                </RBACWrapper>
              );
            }

            return content;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
