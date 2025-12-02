"use client";

import { useEffect, useState } from "react";

import { useTheme } from "@/lib/ThemeContext";
import { useAuth, Session } from "@/lib/AuthContext";

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

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  );
}

function DeviceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/>
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  );
}

function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
    </svg>
  );
}

type AccountSettings = {
  name: string;
  email: string;
  phone: string;
  department: string;
  notifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
};

export default function AccountSettingsPage() {
  const { isDark } = useTheme();
  const { user, updateUser, changePassword, toggleTwoFactor, sessions, terminateSession, terminateAllOtherSessions } = useAuth();
  
  const [formData, setFormData] = useState<AccountSettings>({
    name: "",
    email: "",
    phone: "",
    department: "Operations",
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
  });
  const [originalData, setOriginalData] = useState<AccountSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isToggling2FA, setIsToggling2FA] = useState(false);

  // Sessions modal state
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      const userData: AccountSettings = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "Operations",
        notifications: user.notifications ?? true,
        emailAlerts: user.emailAlerts ?? true,
        smsAlerts: user.smsAlerts ?? false,
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setSaveMessage({ type: "error", text: "Name is required" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setSaveMessage({ type: "error", text: "Valid email is required" });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      notifications: formData.notifications,
      emailAlerts: formData.emailAlerts,
      smsAlerts: formData.smsAlerts,
    });

    setOriginalData(formData);
    setIsSaving(false);
    setSaveMessage({ type: "success", text: "Settings saved successfully!" });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setSaveMessage({ type: "success", text: "Changes discarded" });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setIsChangingPassword(true);

    const result = await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );

    setIsChangingPassword(false);

    if (result.success) {
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSaveMessage({ type: "success", text: "Password changed successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setPasswordError(result.error || "Failed to change password");
    }
  };

  const handle2FAToggle = async () => {
    setIsToggling2FA(true);
    const result = await toggleTwoFactor();
    setIsToggling2FA(false);
    
    if (result.success) {
      setShow2FAModal(false);
      setSaveMessage({ 
        type: "success", 
        text: result.enabled ? "Two-factor authentication enabled!" : "Two-factor authentication disabled" 
      });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const getPasswordAge = () => {
    if (!user?.passwordLastChanged) return "Unknown";
    const days = Math.floor((Date.now() - new Date(user.passwordLastChanged).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const formatSessionTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-light-grey border-t-primary-red" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Success/Error Message */}
      {saveMessage && (
        <div
          className={`fixed top-20 right-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            saveMessage.type === "success"
              ? "bg-status-green text-pure-white"
              : "bg-primary-red text-pure-white"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <header>
        <h1 className={`text-3xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
          Account Settings
        </h1>
        <p className={`text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
          Manage your account details, security settings, and notification preferences.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Profile Card */}
        <article className={`rounded-3xl border p-6 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary-red ${isDark ? "bg-primary-red/20" : "bg-light-red/30"}`}>
              <ProfileIcon className="h-12 w-12 text-primary-red" />
            </div>
            <h2 className={`mt-4 text-xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              {user.name}
            </h2>
            <p className={`text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>{user.role}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-status-green" : "bg-status-danger"}`} />
              <span className={`text-xs font-medium ${user.status === "active" ? "text-status-green" : "text-status-danger"}`}>
                {user.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className={`mt-4 w-full space-y-2 border-t pt-4 text-left ${isDark ? "border-dark-border" : "border-light-grey"}`}>
              <div className="flex justify-between text-sm">
                <span className={`transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Email</span>
                <span className={`font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={`transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Phone</span>
                <span className={`font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  {user.phone || "Not set"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={`transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Department</span>
                <span className={`font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  {user.department || "Not set"}
                </span>
              </div>
            </div>

            {hasChanges && (
              <div className="mt-4 w-full rounded-xl bg-status-warning-1/20 px-3 py-2 text-xs font-medium text-status-warning-2">
                You have unsaved changes
              </div>
            )}
          </div>
        </article>

        {/* Settings Form */}
        <article className={`rounded-3xl border p-6 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            Account Information
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
                    isDark
                      ? "border-dark-border bg-dark-bg text-dark-text placeholder:text-dark-text-muted"
                      : "border-light-grey bg-pure-white text-dark-charcoal"
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
                    isDark
                      ? "border-dark-border bg-dark-bg text-dark-text placeholder:text-dark-text-muted"
                      : "border-light-grey bg-pure-white text-dark-charcoal"
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className={`block text-sm font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
                    isDark
                      ? "border-dark-border bg-dark-bg text-dark-text placeholder:text-dark-text-muted"
                      : "border-light-grey bg-pure-white text-dark-charcoal"
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className={`block text-sm font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
                    isDark
                      ? "border-dark-border bg-dark-bg text-dark-text"
                      : "border-light-grey bg-pure-white text-dark-charcoal"
                  }`}
                >
                  <option>Operations</option>
                  <option>Engineering</option>
                  <option>Field Services</option>
                  <option>Management</option>
                </select>
              </div>
            </div>

            <div className={`border-t pt-5 ${isDark ? "border-dark-border" : "border-light-grey"}`}>
              <h3 className={`text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                Notification Preferences
              </h3>
              <div className="mt-3 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                  />
                  <span className={`text-sm transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                    Enable push notifications
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={formData.emailAlerts}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                  />
                  <span className={`text-sm transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                    Email alerts for danger-level events
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="smsAlerts"
                    checked={formData.smsAlerts}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                  />
                  <span className={`text-sm transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                    SMS alerts for critical events
                  </span>
                </label>
              </div>
            </div>

            <div className={`flex flex-wrap justify-end gap-3 border-t pt-5 ${isDark ? "border-dark-border" : "border-light-grey"}`}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={!hasChanges}
                className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-dark-border text-dark-text hover:bg-dark-bg"
                    : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </article>
      </div>

      {/* Security Section */}
      <article className={`rounded-3xl border p-6 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
        <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
          Security Settings
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Password Card */}
          <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-bg" : "border-light-grey"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-primary-red/20" : "bg-light-red"}`}>
                <LockIcon className="h-5 w-5 text-primary-red" />
              </div>
              <div>
                <p className={`text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Password</p>
                <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  Last changed {getPasswordAge()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="mt-3 text-sm font-semibold text-primary-red hover:underline"
            >
              Change Password
            </button>
          </div>

          {/* 2FA Card */}
          <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-bg" : "border-light-grey"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-primary-red/20" : "bg-light-red"}`}>
                <ShieldIcon className="h-5 w-5 text-primary-red" />
              </div>
              <div>
                <p className={`text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Two-Factor Auth
                </p>
                <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  {user.twoFactorEnabled ? "Currently enabled" : "Currently disabled"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShow2FAModal(true)}
              className="mt-3 text-sm font-semibold text-primary-red hover:underline"
            >
              {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>

          {/* Sessions Card */}
          <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-bg" : "border-light-grey"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-primary-red/20" : "bg-light-red"}`}>
                <DeviceIcon className="h-5 w-5 text-primary-red" />
              </div>
              <div>
                <p className={`text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Active Sessions
                </p>
                <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  {sessions.length} device{sessions.length !== 1 ? "s" : ""} logged in
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSessionsModal(true)}
              className="mt-3 text-sm font-semibold text-primary-red hover:underline"
            >
              View Sessions
            </button>
          </div>
        </div>
      </article>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-xl ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
            <h3 className={`text-lg font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
              {passwordError && (
                <div className="rounded-xl bg-primary-red/10 px-4 py-2 text-sm text-primary-red">
                  {passwordError}
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary-red ${
                      isDark ? "border-dark-border bg-dark-bg text-dark-text" : "border-light-grey bg-pure-white text-dark-charcoal"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}
                  >
                    {showPasswords.current ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary-red ${
                      isDark ? "border-dark-border bg-dark-bg text-dark-text" : "border-light-grey bg-pure-white text-dark-charcoal"
                    }`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}
                  >
                    {showPasswords.new ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                <p className={`mt-1 text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Confirm New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary-red ${
                      isDark ? "border-dark-border bg-dark-bg text-dark-text" : "border-light-grey bg-pure-white text-dark-charcoal"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}
                  >
                    {showPasswords.confirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordError("");
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    isDark ? "border-dark-border text-dark-text hover:bg-dark-bg" : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="rounded-xl bg-primary-red px-4 py-2 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:opacity-50"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-xl ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-primary-red/20" : "bg-light-red"}`}>
                <ShieldIcon className="h-6 w-6 text-primary-red" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  {user.twoFactorEnabled ? "Disable" : "Enable"} Two-Factor Authentication
                </h3>
              </div>
            </div>
            
            <p className={`mt-4 text-sm ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
              {user.twoFactorEnabled 
                ? "Disabling two-factor authentication will make your account less secure. Are you sure you want to continue?"
                : "Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app each time you log in."
              }
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  isDark ? "border-dark-border text-dark-text hover:bg-dark-bg" : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handle2FAToggle}
                disabled={isToggling2FA}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-pure-white transition disabled:opacity-50 ${
                  user.twoFactorEnabled ? "bg-status-danger hover:bg-status-danger/90" : "bg-status-green hover:bg-status-green/90"
                }`}
              >
                {isToggling2FA ? "Processing..." : user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/50 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-xl ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                Active Sessions
              </h3>
              <button
                type="button"
                onClick={() => setShowSessionsModal(false)}
                className={`text-xl font-bold ${isDark ? "text-dark-text-muted hover:text-dark-text" : "text-dark-charcoal/60 hover:text-dark-charcoal"}`}
              >
                ×
              </button>
            </div>

            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {sessions.length === 0 ? (
                <p className={`text-center py-8 text-sm ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  No active sessions
                </p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between rounded-xl border p-4 ${
                      isDark ? "border-dark-border bg-dark-bg" : "border-light-grey bg-very-light-grey"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <DeviceIcon className={`h-8 w-8 ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                          {session.browser} on {session.device}
                          {session.isCurrent && (
                            <span className="ml-2 rounded-full bg-status-green/20 px-2 py-0.5 text-[10px] font-bold text-status-green">
                              CURRENT
                            </span>
                          )}
                        </p>
                        <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                          {session.location} • {formatSessionTime(session.lastActive)}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        type="button"
                        onClick={() => terminateSession(session.id)}
                        className="text-xs font-semibold text-primary-red hover:underline"
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {sessions.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  terminateAllOtherSessions();
                  setSaveMessage({ type: "success", text: "All other sessions terminated" });
                  setTimeout(() => setSaveMessage(null), 3000);
                }}
                className="mt-4 w-full rounded-xl border border-primary-red bg-primary-red/10 px-4 py-2 text-sm font-semibold text-primary-red transition hover:bg-primary-red/20"
              >
                Terminate All Other Sessions
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
