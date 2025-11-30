"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import logo from "@/app/images/logo.png";

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

type TopBarProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export default function TopBar({
  isSidebarCollapsed,
  onToggleSidebar,
}: TopBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-light-grey bg-pure-white/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-1 items-center">
          {/* Hamburger – always visible to toggle sidebar */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-pressed={!isSidebarCollapsed}
            aria-label="Toggle sidebar"
            className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-red transition hover:bg-light-red/40"
          >
            <HamburgerIcon className="h-6 w-6" />
          </button>

          {/* Mobile hamburger (visible on small screens) */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-pressed={!isSidebarCollapsed}
            aria-label="Toggle navigation"
            className="flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-light-red text-primary-red transition hover:bg-light-red/40"
          >
            <HamburgerIcon className="h-6 w-6" />
          </button>

          {/* Dynamic spacer – adjusts based on sidebar state */}
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
            <div>
              <p className="text-base font-semibold leading-tight text-dark-charcoal">
                Flood Management
              </p>
              <p className="text-xs uppercase tracking-wide text-primary-red">
                IoT Command Center
              </p>
            </div>
          </div>

          {/* Search – desktop */}
          <div className="ml-auto hidden w-full max-w-xs items-center gap-2 rounded-full border border-primary-red bg-pure-white px-4 py-2 text-sm text-dark-charcoal focus-within:ring-2 focus-within:ring-primary-red/40 lg:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-primary-red"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
              className="w-full border-none bg-transparent text-sm outline-none placeholder:text-dark-charcoal/60"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search – mobile */}
          <div className="flex w-full items-center gap-2 rounded-full border border-primary-red bg-pure-white px-4 py-2 text-sm text-dark-charcoal lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-primary-red"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
              className="w-full border-none bg-transparent text-sm outline-none placeholder:text-dark-charcoal/60"
            />
          </div>
          <Link
            href="/alerts"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red hover:border-primary-red"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red hover:border-primary-red"
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </Link>

          {/* Profile card with admin info and active status – clickable to admin settings */}
          <Link
            href="/admin"
            className="relative flex items-center gap-2 rounded-xl border border-primary-red bg-pure-white px-3 py-1.5 transition hover:bg-light-red/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary-red bg-primary-red">
              <ProfileIcon className="h-5 w-5 text-pure-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold leading-tight text-dark-charcoal">
                Admin
              </p>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
                <span className="text-[10px] text-dark-charcoal/70">Active</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

