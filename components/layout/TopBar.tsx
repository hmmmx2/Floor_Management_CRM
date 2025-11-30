"use client";

import { useState } from "react";

import Image from "next/image";

import NotificationIcon from "@/app/images/notification-bar.svg";
import ProfileIcon from "@/app/images/profile.svg";
import SettingsIcon from "@/app/images/setting.svg";
import logo from "@/app/images/logo.png";

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
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-1 items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-pressed={!isSidebarCollapsed}
            aria-label="Toggle navigation"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-light-red text-primary-red transition hover:bg-light-red/40 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-3 sm:gap-4">
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
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red"
            aria-label="Notifications"
          >
            <NotificationIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red"
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-primary-red text-pure-white">
            <ProfileIcon className="h-5 w-5 text-pure-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

