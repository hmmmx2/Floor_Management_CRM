"use client";

import dynamic from "next/dynamic";

import { ThemeProvider } from "./ThemeProvider";

// Dynamically import AppShell with no SSR to prevent prerender issues
const AppShell = dynamic(() => import("./AppShell"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-very-light-grey dark:bg-dark-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-light-grey border-t-primary-red dark:border-dark-border" />
        <p className="text-sm font-medium text-dark-charcoal/70 dark:text-dark-text-secondary">Loading...</p>
      </div>
    </div>
  ),
});

type AppShellWrapperProps = {
  children: React.ReactNode;
};

export default function AppShellWrapper({ children }: AppShellWrapperProps) {
  return (
    <ThemeProvider>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
}
