import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Search, Sparkles, BarChart3, Settings, LogOut, Boxes, History, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { title: "Overview",          url: "/dashboard",          icon: LayoutDashboard, end: true },
  { title: "Product Research",  url: "/dashboard/research", icon: Search },
  { title: "Search History",    url: "/dashboard/history",  icon: History },
  { title: "Brand Intelligence",url: "/dashboard/brand",    icon: Boxes },
  { title: "AI Insights",       url: "/dashboard/ai",       icon: Sparkles },
  { title: "Reports",           url: "/dashboard/reports",  icon: BarChart3 },
  { title: "Settings",          url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate  = useNavigate();
  const { logout, user } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate("/sign-in");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 px-4 py-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="WholesaleOS" className="h-8 w-8 rounded-lg object-cover shrink-0" />
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight">
              Wholesale<span className="gradient-text">OS</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline transition-smooth ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-2 space-y-1">
        {user?.isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-2 py-2 text-sm w-full no-underline transition-smooth ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`
            }
          >
            <Shield className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Admin</span>}
          </NavLink>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
