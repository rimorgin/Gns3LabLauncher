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
import { useSidebarStore } from "@clnt/lib/store/sidebar-store";
import { useShallow } from "zustand/react/shallow";

export default function NavMain({
  items,
  role,
}: {
  role: string;
  items: {
    title: string;
    icon?: Icon;
  }[];
}) {
  const activeNavName = useSidebarStore(
    useShallow((state) => state.activeNavName),
  );
  const setActiveNavName = useSidebarStore(
    useShallow((state) => state.setActiveNavName),
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.title === activeNavName;

            return (
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
                    <span>
                      {role === "student" ? "My Learning" : item.title}
                    </span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
