import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@clnt/components/ui/sidebar";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { IUser, useLogout } from "@clnt/lib/auth";

export default function NavUser({
  user,
}: {
  user?: (IUser & { avatar?: string }) | null; // Optional avatar override
}) {
  const logoutUser = useLogout()
  const { isMobile } = useSidebar();
  const { isAppLoading } = useAppStateStore();

  const initials = user?.name
    ? user?.name
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
    : "";

  const handleLogout = async () => {
    try {
      await logoutUser.mutate({});
    } catch {
      return;
    }
    return toast.error("Logout successful");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isAppLoading}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isAppLoading ? (
                <Skeleton className="h-8 w-8 rounded-sm" />
              ) : (
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user?.avatar} alt={user?.name ?? 'alt'} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="grid flex-1 text-left text-sm leading-tight">
                {isAppLoading ? (
                  <>
                    <Skeleton className="h-4 w-2/3 rounded-lg my-1" />{" "}
                    <Skeleton className="h-4 w-auto rounded-lg my-1" />{" "}
                  </>
                ) : (
                  <>
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </span>
                  </>
                )}
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name ?? 'alt'} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
