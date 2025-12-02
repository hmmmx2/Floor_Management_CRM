"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useAuth } from "@/lib/AuthContext";
import { canAccessPage } from "@/lib/permissions";

// Dynamically import AppShell with no SSR to prevent prerender issues
const AppShell = dynamic(() => import("./AppShell"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-very-light-grey">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-light-grey border-t-primary-red" />
        <p className="text-sm font-medium text-dark-charcoal/70">Loading...</p>
      </div>
    </div>
  ),
});

type AppShellWrapperProps = {
  children: React.ReactNode;
};

// Public routes that don't require authentication
const publicRoutes = ["/login"];

// Access Denied component
function AccessDenied() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="rounded-3xl border border-primary-red/30 bg-light-red/20 p-8 text-center dark:border-primary-red/20 dark:bg-primary-red/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-red/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 text-primary-red"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-dark-charcoal dark:text-dark-text">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-dark-charcoal/70 dark:text-dark-text-secondary">
          You don't have permission to access this page.
        </p>
        <p className="mt-1 text-xs text-dark-charcoal/50 dark:text-dark-text-muted">
          Contact your administrator if you believe this is an error.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-xl bg-primary-red px-6 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function AppShellWrapper({ children }: AppShellWrapperProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if user has access to the current page
  const hasPageAccess = useMemo(() => {
    if (!user?.role) return false;
    return canAccessPage(user.role, pathname);
  }, [user?.role, pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
      } else if (isAuthenticated && isPublicRoute) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-very-light-grey dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-light-grey border-t-primary-red dark:border-dark-border" />
          <p className="text-sm font-medium text-dark-charcoal/70 dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show AppShell for public routes (login)
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Will redirect to login
  if (!isAuthenticated) {
    return null;
  }

  // Show AppShell with access denied message if user doesn't have permission
  if (!hasPageAccess) {
    return (
      <AppShell>
        <AccessDenied />
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
}
