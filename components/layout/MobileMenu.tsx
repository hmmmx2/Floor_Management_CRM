"use client";

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
import { useTheme } from "@/lib/ThemeContext";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { Permission } from "@/lib/permissions";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.03 7.03 0 00-1.69-.98l-.38-2.65A.49.49 0 0014 2h-4a.49.49 0 00-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 00-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.39 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65a7.03 7.03 0 001.69-.98l2.49 1a.5.5 0 00.61-.22l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
    </svg>
  );
}

function AccountIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
}

type NavItemType = {
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: Permission;
  alwaysShow?: boolean;
};

const mainNavItems: NavItemType[] = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon, permission: "dashboard.view" },
  { label: "Sensors", href: "/sensors", Icon: SensorsIcon, permission: "sensors.view" },
  { label: "Flood Map", href: "/map", Icon: MapIcon, permission: "map.view" },
  { label: "Analytics", href: "/analytics", Icon: AnalyticsIcon, permission: "analytics.view" },
  { label: "Alerts", href: "/alerts", Icon: AlertsIcon, permission: "alerts.view" },
];

const managementItems: NavItemType[] = [
  { label: "Role Management", href: "/roles", Icon: RolesIcon, permission: "roles.manage" },
  { label: "Account Settings", href: "/admin", Icon: AccountIcon, alwaysShow: true },
  { label: "CRM Settings", href: "/settings", Icon: SettingsIcon, permission: "settings.manage" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const { can } = usePermissions();

  // Filter items based on permissions
  const accessibleMainItems = mainNavItems.filter(
    (item) => item.alwaysShow || (item.permission && can(item.permission))
  );
  
  const accessibleManagementItems = managementItems.filter(
    (item) => item.alwaysShow || (item.permission && can(item.permission))
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 backdrop-blur-sm md:hidden",
          isDark ? "bg-dark-bg/70" : "bg-dark-charcoal/50"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={clsx(
          "fixed inset-x-0 top-0 z-50 md:hidden",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div
          className={clsx(
            "shadow-xl",
            isDark ? "bg-dark-card" : "bg-pure-white"
          )}
        >
          {/* Header */}
          <div
            className={clsx(
              "flex items-center justify-between border-b px-4 py-4",
              isDark ? "border-dark-border" : "border-light-grey"
            )}
          >
            <p
              className={clsx(
                "text-lg font-semibold",
                isDark ? "text-dark-text" : "text-dark-charcoal"
              )}
            >
              Menu
            </p>
            <button
              type="button"
              onClick={onClose}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-xl transition",
                isDark
                  ? "text-dark-text hover:bg-dark-border hover:text-primary-red"
                  : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red"
              )}
              aria-label="Close menu"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="max-h-[70vh] overflow-y-auto px-4 py-4">
            {/* Main Section */}
            <p
              className={clsx(
                "mb-2 text-[10px] font-bold uppercase tracking-wider",
                isDark ? "text-dark-text-muted" : "text-dark-charcoal/50"
              )}
            >
              Main
            </p>
            <div className="space-y-1">
              {accessibleMainItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const ItemIcon = item.Icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? isDark
                          ? "bg-primary-red/20 text-primary-red"
                          : "bg-light-red/60 text-primary-red"
                        : isDark
                        ? "text-dark-text hover:bg-dark-border/50 hover:text-primary-red"
                        : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red"
                    )}
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
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Management Section - only show if there are accessible items */}
            {accessibleManagementItems.length > 0 && (
              <>
                <div
                  className={clsx(
                    "my-4 border-t",
                    isDark ? "border-dark-border" : "border-light-grey"
                  )}
                />
                <p
                  className={clsx(
                    "mb-2 text-[10px] font-bold uppercase tracking-wider",
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/50"
                  )}
                >
                  Management
                </p>
                <div className="space-y-1">
                  {accessibleManagementItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    const ItemIcon = item.Icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                          isActive
                            ? isDark
                              ? "bg-primary-red/20 text-primary-red"
                              : "bg-light-red/60 text-primary-red"
                            : isDark
                            ? "text-dark-text hover:bg-dark-border/50 hover:text-primary-red"
                            : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red"
                        )}
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
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </nav>

          {/* Footer */}
          <div
            className={clsx(
              "border-t px-4 py-3",
              isDark
                ? "border-dark-border bg-dark-bg"
                : "border-light-grey bg-very-light-grey"
            )}
          >
            <p
              className={clsx(
                "text-center text-xs",
                isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
              )}
            >
              © 2025 Malaysian Red Crescent
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
