"use client";

import type { ComponentType, SVGProps } from "react";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AccountIcon,
  AlertsIcon,
  AnalyticsIcon,
  DashboardIcon,
  MapIcon,
  RolesIcon,
  SensorsIcon,
} from "@/components/icons/NavIcons";
import { useTheme } from "@/lib/ThemeContext";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { Permission } from "@/lib/permissions";

type SidebarProps = {
  isCollapsed: boolean;
};

type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  section?: "main" | "management";
  permission: Permission;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon, section: "main", permission: "dashboard.view" },
  { label: "Sensors", href: "/sensors", Icon: SensorsIcon, section: "main", permission: "sensors.view" },
  { label: "Flood Map", href: "/map", Icon: MapIcon, section: "main", permission: "map.view" },
  { label: "Analytics", href: "/analytics", Icon: AnalyticsIcon, section: "main", permission: "analytics.view" },
  { label: "Alerts", href: "/alerts", Icon: AlertsIcon, section: "main", permission: "alerts.view" },
  { label: "Role Management", href: "/roles", Icon: RolesIcon, section: "management", permission: "roles.manage" },
  { label: "Account Settings", href: "/admin", Icon: AccountIcon, section: "management", permission: "dashboard.view" },
];

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const { can, isAdmin } = usePermissions();

  // Filter nav items based on permissions
  const accessibleItems = navItems.filter((item) => can(item.permission));
  
  const mainItems = accessibleItems.filter((item) => item.section === "main");
  const managementItems = accessibleItems.filter((item) => item.section === "management");

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const ItemIcon = item.Icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={clsx(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
          isCollapsed ? "justify-center" : "justify-start",
          isActive
            ? isDark
              ? "bg-primary-red/20 text-primary-red"
              : "bg-light-red/60 text-primary-red"
            : isDark
              ? "text-dark-text hover:bg-dark-border/50 hover:text-primary-red"
              : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red"
        )}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        <ItemIcon
          className={clsx(
            "h-5 w-5 shrink-0",
            isActive
              ? "text-primary-red"
              : isDark
                ? "text-dark-text-secondary"
                : "text-dark-charcoal"
          )}
        />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col border-r shadow-sm transition-all duration-200",
        isCollapsed ? "w-20" : "w-64",
        isDark
          ? "border-dark-border bg-dark-card"
          : "border-light-grey bg-pure-white"
      )}
    >
      {/* Main navigation links */}
      <nav className="mt-4 flex flex-1 flex-col px-3">
        <div className="flex flex-col gap-2">
          {mainItems.map(renderNavItem)}
        </div>

        {/* Management section - only show if there are accessible management items */}
        {managementItems.length > 0 && (
          <>
            {/* Management section divider */}
            <div
              className={clsx(
                "my-4 border-t",
                isDark ? "border-dark-border" : "border-light-grey"
              )}
            />

            {/* Management section label */}
            {!isCollapsed && (
              <p
                className={clsx(
                  "mb-2 px-4 text-[10px] font-bold uppercase tracking-wider",
                  isDark ? "text-dark-text-muted" : "text-dark-charcoal/50"
                )}
              >
                Management
              </p>
            )}

            <div className="flex flex-col gap-2 pb-6">
              {managementItems.map(renderNavItem)}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
