"use client";

import type { ComponentType, SVGProps } from "react";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AlertsIcon,
  AnalyticsIcon,
  DashboardIcon,
  MapIcon,
  RolesIcon,
  SensorsIcon,
} from "@/components/icons/NavIcons";

type SidebarProps = {
  isCollapsed: boolean;
};

type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  section?: "main" | "management";
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon, section: "main" },
  { label: "Sensors", href: "/sensors", Icon: SensorsIcon, section: "main" },
  { label: "Flood Map", href: "/map", Icon: MapIcon, section: "main" },
  { label: "Analytics", href: "/analytics", Icon: AnalyticsIcon, section: "main" },
  { label: "Alerts", href: "/alerts", Icon: AlertsIcon, section: "main" },
  { label: "Role Management", href: "/roles", Icon: RolesIcon, section: "management" },
];

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const mainItems = navItems.filter((item) => item.section === "main");
  const managementItems = navItems.filter((item) => item.section === "management");

  const renderNavItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    const ItemIcon = item.Icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={clsx(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
          isCollapsed ? "justify-center" : "justify-start",
          isActive
            ? "bg-light-red/60 text-primary-red dark:bg-primary-red/20"
            : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red dark:text-dark-text dark:hover:bg-primary-red/15"
        )}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        <ItemIcon
          className={clsx(
            "h-5 w-5 shrink-0",
            isActive ? "text-primary-red" : "text-dark-charcoal dark:text-dark-text"
          )}
        />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col border-r border-light-grey bg-pure-white shadow-sm transition-all duration-300 dark:bg-dark-card dark:border-dark-border",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Main navigation links */}
      <nav className="mt-4 flex flex-1 flex-col px-3">
        <div className="flex flex-col gap-2">
          {mainItems.map(renderNavItem)}
        </div>

        {/* Management section divider */}
        <div className="my-4 border-t border-light-grey dark:border-dark-border" />

        {/* Management section label */}
        {!isCollapsed && (
          <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-dark-charcoal/50 dark:text-dark-text-muted">
            Management
          </p>
        )}

        <div className="flex flex-col gap-2 pb-6">
          {managementItems.map(renderNavItem)}
        </div>
      </nav>
    </aside>
  );
}
