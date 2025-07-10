"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarIcon,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@clnt/components/ui/sidebar";
import { useSidebarStore } from "@clnt/lib/store/sidebar-store";

export default function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const activeNavName = useSidebarStore((state) => state.activeNavName);
  const setActiveNavName = useSidebarStore((state) => state.setActiveNavName);
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = activeNavName === item.title;
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
                    <span>{item.title}</span>
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
