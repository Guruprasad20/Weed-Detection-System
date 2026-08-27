import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ScanLine, BarChart3, Droplets, Plane, FileBarChart,
  Info, Mail, Leaf, Cpu,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const main = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, end: true },
  { title: "Detection", url: "/app/detection", icon: ScanLine },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
  { title: "Smart Sprayer", url: "/app/sprayer", icon: Droplets },
  { title: "Drone Monitor", url: "/app/drone", icon: Plane },
  { title: "Reports", url: "/app/reports", icon: FileBarChart },
];
const more = [
  { title: "Tech Stack", url: "/app/tech", icon: Cpu },
  { title: "About Project", url: "/app/about", icon: Info },
  { title: "Contact", url: "/app/contact", icon: Mail },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <NavLink to="/" className="flex items-center gap-2 px-2 py-2 font-heading font-bold text-primary">
          <Leaf className="w-6 h-6 shrink-0" />
          {!collapsed && <span>WeedVision AI</span>}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={isActive(i.url, i.end)}>
                    <NavLink to={i.url} end={i.end}>
                      <i.icon className="h-4 w-4" />
                      {!collapsed && <span>{i.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {more.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={isActive(i.url)}>
                    <NavLink to={i.url}>
                      <i.icon className="h-4 w-4" />
                      {!collapsed && <span>{i.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
