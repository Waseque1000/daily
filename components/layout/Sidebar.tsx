"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  Calendar,
  Target,
  BarChart3,
  Plug,
  Settings,
  LogOut,
  Sparkles,
  BellRing,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "./Logo";
import { NAV_ITEMS } from "@/lib/constants";
import { useAppStore } from "@/store/store";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSync } from "@/hooks/useSync";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Sun,
  Calendar,
  Target,
  BarChart3,
  Plug,
  Settings,
  Sparkles,
  BellRing,
};

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebarStore = useAppStore((s) => s.toggleSidebar);
  const { signOut } = useAuth();
  const { syncPreferences } = useSync();

  const toggleSidebar = () => {
    const next = !collapsed;
    toggleSidebarStore();
    syncPreferences({ sidebarCollapsed: next }).catch(() => {});
  };

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className={cn("p-4 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && <Logo />}
          {collapsed && <Logo showText={false} />}
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 rounded-lg text-text-muted hover:bg-background transition-colors",
              collapsed && "mt-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-text-body hover:bg-background hover:text-text-heading",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              window.location.href = "/login";
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-danger hover:bg-danger/5 transition-all w-full",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 flex justify-around py-2 px-2 safe-area-pb">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = iconMap[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-2 rounded-xl min-w-[44px] min-h-[44px] justify-center",
                active ? "text-primary" : "text-text-muted"
              )}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
