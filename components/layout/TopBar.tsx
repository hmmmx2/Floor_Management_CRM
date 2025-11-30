"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import logo from "@/app/images/logo.png";
import { getAllPages, highlightMatch, searchPages, type SearchResult } from "@/lib/search";

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

// Icons for search results
const resultIcons: Record<SearchResult["icon"], React.ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 22 22" fill="currentColor" className="h-5 w-5">
      <path d="M11.749 2.496a1 1 0 0 0-1.495-.001L2.554 9.646a1.02 1.02 0 0 0-.275 1.206c.165.42.567.698 1.021.698h.55v6.05c0 1.213.987 2.2 2.2 2.2h9.9c1.213 0 2.2-.987 2.2-2.2v-6.05h.55c.453 0 .859-.278 1.024-.698a1.02 1.02 0 0 0-.275-1.206l-7.7-7.15ZM10.45 13.2h1.1c.911 0 1.65.739 1.65 1.65v3.3h-4.4v-3.3c0-.911.739-1.65 1.65-1.65Z" />
    </svg>
  ),
  sensors: (
    <svg viewBox="0 0 14 19" fill="currentColor" className="h-5 w-5">
      <path d="M10.0684 13.2C10.3194 12.4334 10.8212 11.7391 11.3884 11.1409C12.5125 9.95844 13.2 8.36 13.2 6.6C13.2 2.95625 10.2438 0 6.6 0C2.95625 0 0 2.95625 0 6.6C0 8.36 0.6875 9.95844 1.81156 11.1409C2.37875 11.7391 2.88406 12.4334 3.13156 13.2H10.065H10.0684ZM9.9 14.85H3.3V15.4C3.3 16.9194 4.53062 18.15 6.05 18.15H7.15C8.66938 18.15 9.9 16.9194 9.9 15.4V14.85ZM6.325 3.85C4.95688 3.85 3.85 4.95688 3.85 6.325C3.85 6.78219 3.48219 7.15 3.025 7.15C2.56781 7.15 2.2 6.78219 2.2 6.325C2.2 4.04594 4.04594 2.2 6.325 2.2C6.78219 2.2 7.15 2.56781 7.15 3.025C7.15 3.48219 6.78219 3.85 6.325 3.85Z" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 22 22" fill="currentColor" className="h-5 w-5">
      <path d="M19.8 3.85c0-.381-.196-.735-.522-.934a1.007 1.007 0 0 0-.792-.052L14.215 4.864 8.047 2.805a1.05 1.05 0 0 0-.839.058L2.81 5.063A1.05 1.05 0 0 0 2.2 6.05V18.15c0 .382.196.736.523.935s.735.22 1.076.048l3.99-1.997 5.957 1.987a12 12 0 0 1-1.463-2.684l-3.478-1.158V5.376l4.4 1.468v3.414a4.55 4.55 0 0 1 4.4-.009l.003-6.45ZM17.6 9.9c-2.279 0-4.125 1.815-4.125 4.053 0 2.368 2.204 5.17 3.39 6.507.399.447 1.076.447 1.474 0 1.186-1.337 3.39-4.139 3.39-6.507 0-2.238-1.846-4.053-4.125-4.053Zm-1.375 4.125c0-.76.615-1.375 1.375-1.375s1.375.615 1.375 1.375S18.36 15.4 17.6 15.4s-1.375-.615-1.375-1.375Z" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 22 22" fill="currentColor" className="h-5 w-5">
      <path d="M8.8 4.95c0-.911.739-1.65 1.65-1.65h1.1c.911 0 1.65.739 1.65 1.65V17.05c0 .911-.739 1.65-1.65 1.65h-1.1c-.911 0-1.65-.739-1.65-1.65V4.95ZM2.2 11.55c0-.911.739-1.65 1.65-1.65h1.1c.911 0 1.65.739 1.65 1.65V17.05c0 .911-.739 1.65-1.65 1.65h-1.1c-.911 0-1.65-.739-1.65-1.65V11.55ZM17.05 5.5h1.1c.911 0 1.65.739 1.65 1.65V17.05c0 .911-.739 1.65-1.65 1.65h-1.1c-.911 0-1.65-.739-1.65-1.65V7.15c0-.911.739-1.65 1.65-1.65Z" />
    </svg>
  ),
  alerts: (
    <svg viewBox="0 0 22 22" fill="currentColor" className="h-5 w-5">
      <path d="M11 2.2a1.2 1.2 0 0 1 1.21.722l7.425 13.75a1.2 1.2 0 0 1-1.78 1.357H3.575a1.2 1.2 0 0 1-1.78-1.357l7.425-13.75A1.2 1.2 0 0 1 11 2.2Zm0 12.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm-.08-6.6c-.626 0-1.124.533-1.08 1.159l.255 3.575a.77.77 0 0 0 1.54 0l.254-3.575c.045-.626-.45-1.159-1.08-1.159Z" />
    </svg>
  ),
  roles: (
    <svg viewBox="0 0 22 22" fill="currentColor" className="h-5 w-5">
      <path d="M11 2.2c1.82 0 3.3 1.48 3.3 3.3s-1.48 3.3-3.3 3.3-3.3-1.48-3.3-3.3 1.48-3.3 3.3-3.3Zm0 8.8c2.97 0 6.6 1.485 6.6 3.3v1.1c0 .605-.495 1.1-1.1 1.1H5.5c-.605 0-1.1-.495-1.1-1.1v-1.1c0-1.815 3.63-3.3 6.6-3.3ZM4.4 8.8c1.21 0 2.2-.99 2.2-2.2s-.99-2.2-2.2-2.2-2.2.99-2.2 2.2.99 2.2 2.2 2.2Zm1.1 2.365c-.363-.055-.737-.066-1.1-.066-1.21 0-2.354.275-3.377.759C.407 12.144 0 12.793 0 13.508v1.892h4.4v-1.1c0-.99.385-1.914 1.1-3.135Zm12.1-2.365c1.21 0 2.2-.99 2.2-2.2s-.99-2.2-2.2-2.2-2.2.99-2.2 2.2.99 2.2 2.2 2.2Zm4.4 4.708c0-.715-.407-1.364-1.023-1.65a7.876 7.876 0 0 0-3.377-.759c-.363 0-.737.011-1.1.066.715 1.221 1.1 2.145 1.1 3.135v1.1H22v-1.892Z" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.03 7.03 0 00-1.69-.98l-.38-2.65A.49.49 0 0014 2h-4a.49.49 0 00-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 00-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.39 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65a7.03 7.03 0 001.69-.98l2.49 1a.5.5 0 00.61-.22l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
    </svg>
  ),
};

// Highlighted text component
function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, index) =>
        part.isMatch ? (
          <mark key={index} className="bg-light-red text-primary-red font-bold px-0.5 rounded">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Get results based on search term
  const displayResults = searchTerm.trim()
    ? searchPages(searchTerm)
    : getAllPages();

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop = searchContainerRef.current && !searchContainerRef.current.contains(target);
      const isOutsideMobile = mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || !displayResults.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : displayResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < displayResults.length) {
          handleSelectResult(displayResults[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        break;
    }
  };

  // Navigate to selected page
  const handleSelectResult = (result: SearchResult) => {
    router.push(result.href);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-light-grey bg-pure-white/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-1 items-center">
          {/* Hamburger – desktop */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-pressed={!isSidebarCollapsed}
            aria-label="Toggle sidebar"
            className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-red transition hover:bg-light-red/40"
          >
            <HamburgerIcon className="h-6 w-6" />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-pressed={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-light-red text-primary-red transition hover:bg-light-red/40"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <HamburgerIcon className="h-6 w-6" />
            )}
          </button>

          {/* Dynamic spacer */}
          <div
            className={`hidden md:block shrink-0 transition-[width] duration-200 ${
              isSidebarCollapsed ? "w-4" : "w-40 lg:w-52 xl:w-64"
            }`}
          />

          {/* Logo + Title */}
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

          {/* Desktop Search */}
          <div ref={searchContainerRef} className="relative ml-auto hidden lg:block w-full max-w-sm">
            <div
              className={`flex items-center gap-2 rounded-full border bg-pure-white px-4 py-2.5 text-sm transition-all ${
                showDropdown
                  ? "border-primary-red ring-2 ring-primary-red/20 shadow-lg"
                  : "border-light-grey hover:border-primary-red/50"
              }`}
            >
              <SearchIcon className={`h-5 w-5 ${showDropdown ? "text-primary-red" : "text-dark-charcoal/50"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-dark-charcoal/50"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="rounded-full p-0.5 text-dark-charcoal/40 hover:bg-light-grey hover:text-dark-charcoal"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Desktop Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-light-grey bg-pure-white shadow-2xl">
                {/* Header */}
                <div className="border-b border-light-grey bg-very-light-grey/70 px-4 py-2.5">
                  <p className="text-xs font-semibold text-dark-charcoal/70">
                    {searchTerm.trim() ? (
                      <>
                        Pages containing &quot;<span className="text-primary-red">{searchTerm}</span>&quot; ({displayResults.length})
                      </>
                    ) : (
                      <>All Pages ({displayResults.length})</>
                    )}
                  </p>
                </div>

                {/* Results List */}
                {displayResults.length > 0 ? (
                  <ul className="max-h-[400px] overflow-y-auto">
                    {displayResults.map((result, index) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                            selectedIndex === index
                              ? "bg-light-red/50"
                              : "hover:bg-very-light-grey"
                          }`}
                        >
                          {/* Icon */}
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              selectedIndex === index
                                ? "bg-primary-red text-pure-white"
                                : "bg-light-red/60 text-primary-red"
                            }`}
                          >
                            {resultIcons[result.icon]}
                          </span>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-dark-charcoal">
                              <HighlightedText text={result.title} query={searchTerm} />
                              <span className="ml-2 text-xs font-normal text-dark-charcoal/50">
                                Page
                              </span>
                            </p>
                            <p className="text-xs text-dark-charcoal/60 truncate">
                              <HighlightedText text={result.description} query={searchTerm} />
                            </p>
                          </div>

                          {/* Category & Arrow */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-full bg-very-light-grey px-2 py-0.5 text-[10px] font-medium text-dark-charcoal/60">
                              {result.category}
                            </span>
                            {selectedIndex === index && (
                              <span className="text-primary-red text-sm">→</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <SearchIcon className="mx-auto h-8 w-8 text-dark-charcoal/30" />
                    <p className="mt-2 text-sm font-medium text-dark-charcoal/70">
                      No pages found for &quot;{searchTerm}&quot;
                    </p>
                    <p className="mt-1 text-xs text-dark-charcoal/50">
                      Try searching for dashboard, sensors, or alerts
                    </p>
                  </div>
                )}

                {/* Keyboard hints */}
                <div className="flex items-center justify-between border-t border-light-grey bg-very-light-grey/50 px-4 py-2 text-[10px] text-dark-charcoal/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded bg-light-grey px-1.5 py-0.5 font-mono">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded bg-light-grey px-1.5 py-0.5 font-mono">Enter</kbd>
                      Go to page
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-light-grey px-1.5 py-0.5 font-mono">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Search */}
          <div ref={mobileSearchContainerRef} className="relative w-full lg:hidden">
            <div
              className={`flex items-center gap-2 rounded-full border bg-pure-white px-4 py-2.5 text-sm transition-all ${
                showDropdown
                  ? "border-primary-red ring-2 ring-primary-red/20"
                  : "border-light-grey"
              }`}
            >
              <SearchIcon className={`h-5 w-5 ${showDropdown ? "text-primary-red" : "text-dark-charcoal/50"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-dark-charcoal/50"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="rounded-full p-0.5 text-dark-charcoal/40 hover:text-dark-charcoal"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 z-[60] mt-2 overflow-hidden rounded-2xl border border-light-grey bg-pure-white shadow-2xl">
                <div className="border-b border-light-grey bg-very-light-grey/70 px-4 py-2">
                  <p className="text-xs font-semibold text-dark-charcoal/70">
                    {searchTerm.trim() ? (
                      <>Pages containing &quot;{searchTerm}&quot;</>
                    ) : (
                      <>All Pages</>
                    )}
                  </p>
                </div>
                {displayResults.length > 0 ? (
                  <ul className="max-h-64 overflow-y-auto">
                    {displayResults.map((result, index) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                            selectedIndex === index ? "bg-light-red/50" : ""
                          }`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-light-red/60 text-primary-red">
                            {resultIcons[result.icon]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-dark-charcoal text-sm">
                              <HighlightedText text={result.title} query={searchTerm} /> Page
                            </p>
                            <p className="text-xs text-dark-charcoal/60 truncate">
                              {result.description}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-dark-charcoal/70">No pages found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            href="/alerts"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red hover:border-primary-red"
            aria-label="Notifications"
          >
            <NotificationIcon className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-red text-[10px] font-bold text-pure-white">
              3
            </span>
          </Link>
          <Link
            href="/settings"
            className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-light-grey text-dark-charcoal transition hover:text-primary-red hover:border-primary-red"
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </Link>

          <Link
            href="/admin"
            className="relative flex shrink-0 items-center gap-2 rounded-xl border border-primary-red bg-pure-white px-3 py-1.5 transition hover:bg-light-red/20"
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
