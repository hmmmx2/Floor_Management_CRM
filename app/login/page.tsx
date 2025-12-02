"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
  );
}

export default function LoginPage() {
  const { isDark, toggleTheme } = useTheme();
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? "bg-dark-bg" : "bg-very-light-grey"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 ${isDark ? "border-dark-border border-t-primary-red" : "border-light-grey border-t-primary-red"}`} />
          <p className={`text-sm font-medium ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col ${isDark ? "bg-dark-bg" : "bg-very-light-grey"}`}>
      {/* Minimalist Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors ${isDark ? "border-dark-border/50 bg-dark-card/80" : "border-light-grey/50 bg-pure-white/80"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={36} height={36} />
            <span className={`hidden sm:block text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Flood Management
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                isDark
                  ? "border-dark-border bg-dark-bg hover:border-primary-red text-yellow-400"
                  : "border-light-grey bg-very-light-grey hover:border-primary-red text-amber-500"
              }`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Left Side - Background Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/login-background.png"
              alt="Flood Management"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-dark-charcoal/60 via-dark-charcoal/40 to-primary-red/50" />
          </div>
          <div className="relative z-10 flex flex-1 flex-col justify-center items-center text-center px-12">
            <div className="drop-shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto mb-6"
              />
              <h1 className="text-3xl font-bold text-pure-white mb-3">Flood Management CRM</h1>
              <p className="text-base text-pure-white/90 max-w-sm mx-auto">
                Command center for IoT flood sensors, live alerts, and predictive analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className={`w-full max-w-md rounded-3xl border p-8 shadow-lg transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
            {/* Logo for mobile */}
            <div className="flex justify-center mb-6 lg:hidden">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
              />
            </div>

            <h2 className={`text-2xl font-semibold mb-2 transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Welcome Back
            </h2>
            <p className={`text-sm mb-6 transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              Sign in to your account to continue
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-primary-red/10 border border-primary-red/30 px-4 py-3 text-sm text-primary-red">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
                    isDark
                      ? "border-dark-border bg-dark-bg text-dark-text placeholder:text-dark-text-muted"
                      : "border-light-grey bg-pure-white text-dark-charcoal"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border px-4 py-2.5 pr-12 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
                      isDark
                        ? "border-dark-border bg-dark-bg text-dark-text placeholder:text-dark-text-muted"
                        : "border-light-grey bg-pure-white text-dark-charcoal"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${isDark ? "text-dark-text-muted hover:text-dark-text" : "text-dark-charcoal/60 hover:text-dark-charcoal"}`}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                  />
                  <span className={`transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className={`font-semibold transition-colors hover:text-primary-red ${isDark ? "text-primary-red/80" : "text-primary-red"}`}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary-red px-4 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

          <div className={`mt-6 text-center text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/50"}`}>
            For internal use only. Contact your administrator for access.
          </div>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className={`border-t py-4 transition-colors ${isDark ? "border-dark-border bg-dark-card/50" : "border-light-grey bg-pure-white/50"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
            © {new Date().getFullYear()} Flood Management CRM. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className={`text-xs transition-colors hover:text-primary-red ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              Privacy Policy
            </a>
            <a href="#" className={`text-xs transition-colors hover:text-primary-red ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              Terms of Service
            </a>
            <a href="#" className={`text-xs transition-colors hover:text-primary-red ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
