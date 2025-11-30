"use client";

import { useEffect, useState } from "react";

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

type AdminSettings = {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  notifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
};

const defaultSettings: AdminSettings = {
  name: "Administrator",
  email: "admin@floodmanagement.my",
  phone: "+60 12-345 6789",
  role: "Admin",
  department: "Operations",
  notifications: true,
  emailAlerts: true,
  smsAlerts: false,
};

export default function AdminPage() {
  const [formData, setFormData] = useState<AdminSettings>(defaultSettings);
  const [originalData, setOriginalData] = useState<AdminSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("flood_admin_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setFormData(parsed);
      setOriginalData(parsed);
    }
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
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

    // Validation
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Save to localStorage
    localStorage.setItem("flood_admin_settings", JSON.stringify(formData));
    setOriginalData(formData);

    setIsSaving(false);
    setSaveMessage({ type: "success", text: "Settings saved successfully!" });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setSaveMessage({ type: "success", text: "Changes discarded" });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleResetToDefaults = () => {
    setFormData(defaultSettings);
    localStorage.setItem("flood_admin_settings", JSON.stringify(defaultSettings));
    setOriginalData(defaultSettings);
    setSaveMessage({ type: "success", text: "Settings reset to defaults" });
    setTimeout(() => setSaveMessage(null), 3000);
  };

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
        <h1 className="text-3xl font-semibold text-dark-charcoal">
          Admin Settings
        </h1>
        <p className="text-sm text-dark-charcoal/70">
          Manage your account details and notification preferences.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Profile Card */}
        <article className="rounded-3xl border border-light-grey bg-pure-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary-red bg-light-red/30">
              <ProfileIcon className="h-12 w-12 text-primary-red" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-dark-charcoal">
              {formData.name}
            </h2>
            <p className="text-sm text-dark-charcoal/70">{formData.role}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-green" />
              <span className="text-xs font-medium text-status-green">
                Active
              </span>
            </div>
            <div className="mt-4 w-full space-y-2 border-t border-light-grey pt-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-dark-charcoal/60">Email</span>
                <span className="font-medium text-dark-charcoal">
                  {formData.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-charcoal/60">Phone</span>
                <span className="font-medium text-dark-charcoal">
                  {formData.phone}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-charcoal/60">Department</span>
                <span className="font-medium text-dark-charcoal">
                  {formData.department}
                </span>
              </div>
            </div>

            {/* Unsaved changes indicator */}
            {hasChanges && (
              <div className="mt-4 w-full rounded-xl bg-status-warning-1/20 px-3 py-2 text-xs font-medium text-status-warning-2">
                You have unsaved changes
              </div>
            )}
          </div>
        </article>

        {/* Settings Form */}
        <article className="rounded-3xl border border-light-grey bg-pure-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Account Information
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-dark-charcoal"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-dark-charcoal"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-dark-charcoal"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-dark-charcoal"
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                >
                  <option>Operations</option>
                  <option>Engineering</option>
                  <option>Field Services</option>
                  <option>Management</option>
                </select>
              </div>
            </div>

            <div className="border-t border-light-grey pt-5">
              <h3 className="text-sm font-semibold text-dark-charcoal">
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
                  <span className="text-sm text-dark-charcoal">
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
                  <span className="text-sm text-dark-charcoal">
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
                  <span className="text-sm text-dark-charcoal">
                    SMS alerts for critical events
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-light-grey pt-5">
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="text-sm font-semibold text-dark-charcoal/60 transition hover:text-primary-red"
              >
                Reset to Defaults
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!hasChanges}
                  className="rounded-xl border border-light-grey px-5 py-2.5 text-sm font-semibold text-dark-charcoal transition hover:bg-very-light-grey disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </form>
        </article>
      </div>

      {/* Security Section */}
      <article className="rounded-3xl border border-light-grey bg-pure-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-charcoal">
          Security Settings
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-light-grey p-4">
            <p className="text-sm font-semibold text-dark-charcoal">Password</p>
            <p className="mt-1 text-xs text-dark-charcoal/60">
              Last changed 30 days ago
            </p>
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-primary-red hover:underline"
            >
              Change Password
            </button>
          </div>
          <div className="rounded-2xl border border-light-grey p-4">
            <p className="text-sm font-semibold text-dark-charcoal">
              Two-Factor Auth
            </p>
            <p className="mt-1 text-xs text-dark-charcoal/60">
              Currently enabled
            </p>
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-primary-red hover:underline"
            >
              Manage 2FA
            </button>
          </div>
          <div className="rounded-2xl border border-light-grey p-4">
            <p className="text-sm font-semibold text-dark-charcoal">
              Active Sessions
            </p>
            <p className="mt-1 text-xs text-dark-charcoal/60">
              2 devices logged in
            </p>
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-primary-red hover:underline"
            >
              View Sessions
            </button>
          </div>
        </div>
      </article>

      {/* Activity Log */}
      <article className="rounded-3xl border border-light-grey bg-pure-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-charcoal">
          Recent Activity
        </h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-very-light-grey px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-status-green" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark-charcoal">
                Settings updated
              </p>
              <p className="text-xs text-dark-charcoal/60">Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-very-light-grey px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-status-green" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark-charcoal">
                Logged in from Chrome on Windows
              </p>
              <p className="text-xs text-dark-charcoal/60">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-very-light-grey px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-status-warning-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark-charcoal">
                Password changed
              </p>
              <p className="text-xs text-dark-charcoal/60">30 days ago</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
