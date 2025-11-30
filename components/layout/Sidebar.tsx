"use client";

import type { ComponentType, SVGProps } from "react";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ChartIcon from "@/app/images/chart.svg";
import GeoMapIcon from "@/app/images/geo-map.svg";
import HouseIcon from "@/app/images/house.svg";
import SensorsIcon from "@/app/images/sensors.svg";
import WarningIcon from "@/app/images/warning.svg";
import logo from "@/app/images/logo.png";

type SidebarProps = {
  isCollapsed: boolean;
};

type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: HouseIcon },
  { label: "Sensors", href: "/sensors", Icon: SensorsIcon },
  { label: "Flood Map", href: "/map", Icon: GeoMapIcon },
  { label: "Analytics", href: "/analytics", Icon: ChartIcon },
  { label: "Alerts", href: "/alerts", Icon: WarningIcon },
];

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "flex flex-col border-r border-light-grey bg-pure-white shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-light-red bg-very-light-grey">
          <Image src={logo} alt="Company logo" width={32} height={32} priority />
        </div>
        {!isCollapsed && (
          <div>
            <p className="text-sm font-semibold text-primary-red">CatEye</p>
            <p className="text-sm font-medium text-dark-charcoal">
              Flood Management
            </p>
          </div>
        )}
      </div>
      <nav className="mt-4 flex flex-1 flex-col gap-2 px-3 pb-6">
        {navItems.map((item) => {
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
                  ? "bg-light-red/60 text-primary-red"
                  : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red"
              )}
              aria-current={isActive ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              <ItemIcon
                className={clsx(
                  "h-5 w-5",
                  isActive ? "text-primary-red" : "text-dark-charcoal"
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

