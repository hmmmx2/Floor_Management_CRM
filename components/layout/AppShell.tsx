"use client";

import { useState } from "react";

import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-very-light-grey text-dark-charcoal">
      {/* Top navbar spans full width */}
      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onToggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Menu Dropdown */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Sidebar + main content below navbar */}
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
      </div>

      {/* Footer spans full width at the bottom */}
      <Footer />
    </div>
  );
}
