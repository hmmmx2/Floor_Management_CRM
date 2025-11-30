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

import { useTheme } from "./ThemeProvider";

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

function AdminIcon(props: React.SVGProps<SVGSVGElement>) {
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

// Sun icon for light mode
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon for dark mode
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
  { label: "Sensors", href: "/sensors", Icon: SensorsIcon },
  { label: "Flood Map", href: "/map", Icon: MapIcon },
  { label: "Analytics", href: "/analytics", Icon: AnalyticsIcon },
  { label: "Alerts", href: "/alerts", Icon: AlertsIcon },
];

const managementItems = [
  { label: "Role Management", href: "/roles", Icon: RolesIcon },
  { label: "Admin Settings", href: "/admin", Icon: AdminIcon },
  { label: "CRM Settings", href: "/settings", Icon: SettingsIcon },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-dark-charcoal/50 backdrop-blur-sm md:hidden"
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
        <div className="bg-pure-white shadow-xl dark:bg-dark-card">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-light-grey px-4 py-4 dark:border-dark-border">
            <p className="text-lg font-semibold text-dark-charcoal dark:text-dark-text">Menu</p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-charcoal transition hover:bg-light-red/40 hover:text-primary-red dark:text-dark-text dark:hover:bg-primary-red/20"
              aria-label="Close menu"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="max-h-[70vh] overflow-y-auto px-4 py-4">
            {/* Main Section */}
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-dark-charcoal/50 dark:text-dark-text-muted">
              Main
            </p>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
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
                        ? "bg-light-red/60 text-primary-red dark:bg-primary-red/20"
                        : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red dark:text-dark-text dark:hover:bg-primary-red/15"
                    )}
                  >
                    <ItemIcon
                      className={clsx(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-primary-red" : "text-dark-charcoal dark:text-dark-text"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Management Section */}
            <div className="my-4 border-t border-light-grey dark:border-dark-border" />
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-dark-charcoal/50 dark:text-dark-text-muted">
              Management
            </p>
            <div className="space-y-1">
              {managementItems.map((item) => {
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
                        ? "bg-light-red/60 text-primary-red dark:bg-primary-red/20"
                        : "text-dark-charcoal hover:bg-light-red/40 hover:text-primary-red dark:text-dark-text dark:hover:bg-primary-red/15"
                    )}
                  >
                    <ItemIcon
                      className={clsx(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-primary-red" : "text-dark-charcoal dark:text-dark-text"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle Section */}
            <div className="my-4 border-t border-light-grey dark:border-dark-border" />
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-dark-charcoal/50 dark:text-dark-text-muted">
              Appearance
            </p>
            <div className="flex items-center justify-between rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5 text-amber-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-slate-600 dark:text-dark-text" />
                )}
                <span className="text-sm font-semibold text-dark-charcoal dark:text-dark-text">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                className={clsx(
                  "relative h-7 w-12 rounded-full transition-colors duration-300",
                  theme === "dark" ? "bg-primary-red" : "bg-light-grey"
                )}
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                <span
                  className={clsx(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-pure-white shadow-md transition-transform duration-300",
                    theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-light-grey bg-very-light-grey px-4 py-3 dark:border-dark-border dark:bg-dark-bg">
            <p className="text-center text-xs text-dark-charcoal/60 dark:text-dark-text-muted">
              © 2025 Malaysian Red Crescent
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
