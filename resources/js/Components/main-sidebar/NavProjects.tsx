import { MoreHorizontal, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/Components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  if (projects.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item, index) => (
          <SidebarMenuItem key={`${item.name}-${index}`}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onSelect={() => router.get(item.url)}>
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    router.get(route("project.edit", item.url.split("/").pop()))
                  }
                >
                  <span>Edit Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    router.delete(
                      route("project.destroy", item.url.split("/").pop()),
                    )
                  }
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={route("project.index")}>
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
