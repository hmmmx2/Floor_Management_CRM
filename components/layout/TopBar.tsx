"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import logo from "@/app/images/logo.png";

import SearchModal from "./SearchModal";
import { useTheme } from "./ThemeProvider";

function HamburgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
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

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

function NotificationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2a7 7 0 00-7 7v4.29l-1.71 1.7a1 1 0 00-.21 1.09A1 1 0 004 17h16a1 1 0 00.92-.62 1 1 0 00-.21-1.09L19 13.59V9a7 7 0 00-7-7zm0 20a3 3 0 01-2.83-2h5.66A3 3 0 0112 22z" />
    </svg>
  );
}

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

function ProfileIcon(props: React.SVGProps<SVGSVGElement>) {
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

type TopBarProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
};

export default function TopBar({
  isSidebarCollapsed,
  onToggleSidebar,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-light-grey bg-pure-white/95 backdrop-blur dark:bg-dark-card/95 dark:border-dark-border transition-colors duration-300">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          {/* Left side */}
          <div className="flex items-center">
            {/* Hamburger – desktop (toggles sidebar) */}
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-pressed={!isSidebarCollapsed}
              aria-label="Toggle sidebar"
              className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-red transition hover:bg-light-red/40 dark:hover:bg-primary-red/20"
            >
              <HamburgerIcon className="h-6 w-6" />
            </button>

            {/* Mobile hamburger (toggles mobile menu) */}
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-pressed={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-light-red text-primary-red transition hover:bg-light-red/40 dark:border-primary-red/40 dark:hover:bg-primary-red/20"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <HamburgerIcon className="h-6 w-6" />
              )}
            </button>

            {/* Dynamic spacer – adjusts based on sidebar state (desktop only) */}
            <div
              className={`hidden md:block shrink-0 transition-[width] duration-200 ${
                isSidebarCollapsed ? "w-4" : "w-40 lg:w-52 xl:w-64"
              }`}
            />

            {/* Logo + Title – positioned near main content area */}
            <div className="ml-4 md:ml-0 flex items-center gap-3 shrink-0">
              <Image
                src={logo}
                alt="Flood Management logo"
                width={40}
                height={40}
                priority
              />
              <div className="hidden sm:block">
                <p className="text-base font-semibold leading-tight text-dark-charcoal dark:text-dark-text">
                  Flood Management
                </p>
                <p className="text-xs uppercase tracking-wide text-primary-red">
                  IoT Command Center
                </p>
              </div>
            </div>
          </div>

          {/* Center - Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-1 max-w-md items-center gap-3 rounded-full border border-light-grey bg-very-light-grey/50 px-4 py-2.5 text-sm text-dark-charcoal/50 transition hover:border-primary-red/50 hover:bg-pure-white hover:shadow-sm dark:border-dark-border dark:bg-dark-card/50 dark:text-dark-text-muted dark:hover:bg-dark-card dark:hover:border-primary-red/50"
          >
            <SearchIcon className="h-5 w-5" />
            <span className="flex-1 text-left">Search pages...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-light-grey bg-pure-white px-2 py-1 text-[10px] font-medium text-dark-charcoal/50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-muted">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-light-grey bg-very-light-grey text-dark-charcoal transition-all duration-300 hover:border-primary-red dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
            >
              {/* Sun icon - shown in dark mode (click to go light) */}
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-amber-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-slate-600" />
              )}
            </button>

            <Link
              href="/alerts"
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red hover:border-primary-red dark:border-dark-border dark:text-dark-text dark:hover:border-primary-red"
              aria-label="Notifications"
            >
              <NotificationIcon className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-red text-[10px] font-bold text-pure-white">
                3
              </span>
            </Link>
            <Link
              href="/settings"
              className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red hover:border-primary-red dark:border-dark-border dark:text-dark-text dark:hover:border-primary-red"
              aria-label="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Link>

            {/* Profile card with admin info and active status – clickable to admin settings */}
            <Link
              href="/admin"
              className="relative flex shrink-0 items-center gap-2 rounded-xl border border-primary-red bg-pure-white px-2 sm:px-3 py-1.5 transition hover:bg-light-red/20 dark:bg-dark-card dark:hover:bg-primary-red/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary-red bg-primary-red">
                <ProfileIcon className="h-5 w-5 text-pure-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-dark-charcoal dark:text-dark-text">
                  Admin
                </p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
                  <span className="text-[10px] text-dark-charcoal/70 dark:text-dark-text-secondary">Active</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
