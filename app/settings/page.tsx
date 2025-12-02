"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import { useTheme } from "@/lib/ThemeContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

function GeneralIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.03 7.03 0 00-1.69-.98l-.38-2.65A.49.49 0 0014 2h-4a.49.49 0 00-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 00-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.39 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65a7.03 7.03 0 001.69-.98l2.49 1a.5.5 0 00.61-.22l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
    </svg>
  );
}

function NotificationSettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a7 7 0 00-7 7v4.29l-1.71 1.7a1 1 0 00-.21 1.09A1 1 0 004 17h16a1 1 0 00.92-.62 1 1 0 00-.21-1.09L19 13.59V9a7 7 0 00-7-7zm0 20a3 3 0 01-2.83-2h5.66A3 3 0 0112 22z" />
    </svg>
  );
}

function DataIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 3c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zM4 9.5c1.77 1.21 4.67 2 8 2s6.23-.79 8-2v3c0 1.66-3.58 3-8 3s-8-1.34-8-3v-3zm0 5.5c1.77 1.21 4.67 2 8 2s6.23-.79 8-2v2.5c0 1.66-3.58 3-8 3s-8-1.34-8-3V15z" />
    </svg>
  );
}

function IntegrationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8v-2z" />
    </svg>
  );
}

function SecurityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}

function AppearanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

function MapSettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function BackupIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsTab =
  | "general"
  | "notifications"
  | "data"
  | "integrations"
  | "security"
  | "appearance"
  | "map"
  | "backup";

type CRMSettings = {
  systemName: string;
  organizationName: string;
  timezone: string;
  language: string;
  dateFormat: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  dangerAlertEmail: boolean;
  warningAlertEmail: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  alertSound: string;
  // Data Sync Settings
  liveDataEnabled: boolean;
  refreshInterval: number;
  dataRetentionDays: number;
  autoArchive: boolean;
  exportFormat: string;
  googleMapsApiKey: string;
  mongoDbUri: string;
  webhookUrl: string;
  slackWebhook: string;
  sessionTimeout: number;
  requireMfa: boolean;
  ipWhitelist: string;
  auditLogging: boolean;
  theme: string;
  primaryColor: string;
  sidebarPosition: string;
  compactMode: boolean;
  defaultMapZoom: number;
  defaultMapLat: number;
  defaultMapLng: number;
  mapStyle: string;
  showInactiveNodes: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  backupRetention: number;
  lastBackup: string;
};

const defaultSettings: CRMSettings = {
  systemName: "Flood Management CRM",
  organizationName: "Malaysian Red Crescent",
  timezone: "Asia/Kuala_Lumpur",
  language: "en-MY",
  dateFormat: "DD/MM/YYYY",
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  dangerAlertEmail: true,
  warningAlertEmail: false,
  dailyDigest: true,
  weeklyReport: true,
  alertSound: "default",
  liveDataEnabled: true,
  refreshInterval: 30000,
  dataRetentionDays: 365,
  autoArchive: true,
  exportFormat: "csv",
  googleMapsApiKey: "••••••••••••••••",
  mongoDbUri: "mongodb+srv://••••••••",
  webhookUrl: "",
  slackWebhook: "",
  sessionTimeout: 30,
  requireMfa: false,
  ipWhitelist: "",
  auditLogging: true,
  theme: "light",
  primaryColor: "#ED1C24",
  sidebarPosition: "left",
  compactMode: false,
  defaultMapZoom: 14,
  defaultMapLat: 1.5559,
  defaultMapLng: 110.3463,
  mapStyle: "satellite",
  showInactiveNodes: true,
  autoBackup: true,
  backupFrequency: "daily",
  backupRetention: 30,
  lastBackup: "2025-11-29T08:00:00Z",
};

const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "general", label: "General", icon: GeneralIcon },
  { id: "notifications", label: "Notifications", icon: NotificationSettingsIcon },
  { id: "data", label: "Data Management", icon: DataIcon },
  { id: "integrations", label: "Integrations", icon: IntegrationIcon },
  { id: "security", label: "Security", icon: SecurityIcon },
  { id: "appearance", label: "Appearance", icon: AppearanceIcon },
  { id: "map", label: "Map Settings", icon: MapSettingsIcon },
  { id: "backup", label: "Backup & Restore", icon: BackupIcon },
];

export default function SettingsPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState<CRMSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<CRMSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("crmSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setOriginalSettings(parsed);
    }
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const handleChange = (key: keyof CRMSettings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("crmSettings", JSON.stringify(settings));
    setOriginalSettings(settings);
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    toast("Changes reverted.", { icon: "↩️" });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setOriginalSettings(defaultSettings);
    localStorage.removeItem("crmSettings");
    toast.success("Settings reset to defaults!");
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crm-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported!");
  };

  const handleBackupNow = () => {
    const newBackupTime = new Date().toISOString();
    handleChange("lastBackup", newBackupTime);
    toast.success("Backup created successfully!");
  };

  const handleTestConnection = (service: string) => {
    toast.loading(`Testing ${service} connection...`, { duration: 1500 });
    setTimeout(() => {
      toast.success(`${service} connection successful!`);
    }, 1500);
  };

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || GeneralIcon;

  // Common input class based on theme
  const inputClass = `mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 ${
    isDark
      ? "border-dark-border bg-dark-bg text-dark-text placeholder:text-dark-text-muted"
      : "border-light-grey bg-pure-white text-dark-charcoal"
  }`;

  const labelClass = `block text-sm font-medium transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`;
  const subLabelClass = `text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`;
  const cardClass = `rounded-xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-bg" : "border-light-grey"}`;

  return (
    <section className="space-y-6">
      <Toaster position="top-right" reverseOrder={false} />

      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>CRM Settings</h1>
          <p className={`text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            Configure system preferences, integrations, and security options.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="rounded-full bg-status-warning-1/20 px-3 py-1 text-xs font-semibold text-status-warning-1">
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={handleExportSettings}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              isDark
                ? "border-dark-border text-dark-text hover:bg-dark-bg"
                : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
            }`}
          >
            Export
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Tabs */}
        <aside className={`space-y-2 rounded-3xl border p-4 shadow-sm lg:h-fit lg:sticky lg:top-24 transition-colors ${
          isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? isDark
                      ? "bg-primary-red/20 text-primary-red"
                      : "bg-light-red/60 text-primary-red"
                    : isDark
                      ? "text-dark-text hover:bg-dark-bg"
                      : "text-dark-charcoal hover:bg-very-light-grey"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Settings Content */}
        <article className={`rounded-3xl border p-6 shadow-sm transition-colors ${
          isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"
        }`}>
          <div className={`mb-6 flex items-center gap-3 border-b pb-4 ${isDark ? "border-dark-border" : "border-light-grey"}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-primary-red ${isDark ? "bg-primary-red/20" : "bg-light-red/40"}`}>
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className={subLabelClass}>
                {activeTab === "general" && "Basic system configuration"}
                {activeTab === "notifications" && "Alert and notification preferences"}
                {activeTab === "data" && "Data retention and export settings"}
                {activeTab === "integrations" && "Third-party service connections"}
                {activeTab === "security" && "Access control and authentication"}
                {activeTab === "appearance" && "Theme and display options"}
                {activeTab === "map" && "Map display and default location"}
                {activeTab === "backup" && "Backup scheduling and restoration"}
              </p>
            </div>
          </div>

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>System Name</label>
                  <input
                    type="text"
                    value={settings.systemName}
                    onChange={(e) => handleChange("systemName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Organization Name</label>
                  <input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) => handleChange("organizationName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (GMT+8)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                    <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className={inputClass}
                  >
                    <option value="en-MY">English (Malaysia)</option>
                    <option value="ms-MY">Bahasa Melayu</option>
                    <option value="zh-CN">中文 (简体)</option>
                    <option value="ta-IN">தமிழ்</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleChange("dateFormat", e.target.value)}
                    className={inputClass}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Notification Channels</h3>
                <div className="mt-3 space-y-3">
                  <label className={`flex items-center justify-between ${cardClass}`}>
                    <div>
                      <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Email Notifications</p>
                      <p className={subLabelClass}>Receive alerts via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                      className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                  </label>
                  <label className={`flex items-center justify-between ${cardClass}`}>
                    <div>
                      <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>SMS Notifications</p>
                      <p className={subLabelClass}>Receive critical alerts via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleChange("smsNotifications", e.target.checked)}
                      className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                  </label>
                  <label className={`flex items-center justify-between ${cardClass}`}>
                    <div>
                      <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Push Notifications</p>
                      <p className={subLabelClass}>Browser push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                      className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                  </label>
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Alert Preferences</h3>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.dangerAlertEmail}
                      onChange={(e) => handleChange("dangerAlertEmail", e.target.checked)}
                      className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                    <span className={`text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Email for Danger-level alerts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.warningAlertEmail}
                      onChange={(e) => handleChange("warningAlertEmail", e.target.checked)}
                      className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                    <span className={`text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Email for Warning-level alerts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.dailyDigest}
                      onChange={(e) => handleChange("dailyDigest", e.target.checked)}
                      className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                    <span className={`text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Daily digest summary</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.weeklyReport}
                      onChange={(e) => handleChange("weeklyReport", e.target.checked)}
                      className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                    <span className={`text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Weekly analytics report</span>
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>Alert Sound</label>
                <select
                  value={settings.alertSound}
                  onChange={(e) => handleChange("alertSound", e.target.value)}
                  className={`${inputClass} max-w-xs`}
                >
                  <option value="default">Default</option>
                  <option value="urgent">Urgent</option>
                  <option value="subtle">Subtle</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === "data" && (
            <div className="space-y-5">
              {/* Live Data Sync Section */}
              <div>
                <h3 className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Live Data Sync</h3>
                <p className={subLabelClass}>Control how data is fetched from MongoDB across all pages</p>
                <div className="mt-3 space-y-3">
                  <label className={`flex items-center justify-between ${cardClass}`}>
                    <div>
                      <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Live Mode</p>
                      <p className={subLabelClass}>Automatically refresh data from sensors</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.liveDataEnabled}
                      onChange={(e) => handleChange("liveDataEnabled", e.target.checked)}
                      className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                    />
                  </label>
                  <div>
                    <label className={labelClass}>Refresh Interval</label>
                    <p className={subLabelClass}>How often to fetch new data from MongoDB (applies to all pages)</p>
                    <select
                      value={settings.refreshInterval}
                      onChange={(e) => handleChange("refreshInterval", parseInt(e.target.value))}
                      disabled={!settings.liveDataEnabled}
                      className={`${inputClass} mt-2 max-w-xs disabled:opacity-50`}
                    >
                      <option value={10000}>10 seconds</option>
                      <option value={30000}>30 seconds</option>
                      <option value={60000}>1 minute</option>
                      <option value={120000}>2 minutes</option>
                      <option value={300000}>5 minutes</option>
                      <option value={600000}>10 minutes</option>
                      <option value={1800000}>30 minutes</option>
                      <option value={3600000}>1 hour</option>
                      <option value={7200000}>2 hours</option>
                      <option value={18000000}>5 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`border-t ${isDark ? "border-dark-border" : "border-light-grey"}`} />

              <div>
                <label className={labelClass}>Data Retention Period</label>
                <p className={subLabelClass}>How long to keep historical data</p>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    value={settings.dataRetentionDays}
                    onChange={(e) => handleChange("dataRetentionDays", parseInt(e.target.value))}
                    className={`${inputClass} w-32`}
                  />
                  <span className={`text-sm ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>days</span>
                </div>
              </div>
              <label className={`flex items-center justify-between ${cardClass}`}>
                <div>
                  <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Auto-Archive Old Data</p>
                  <p className={subLabelClass}>Automatically archive data older than retention period</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoArchive}
                  onChange={(e) => handleChange("autoArchive", e.target.checked)}
                  className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                />
              </label>
              <div>
                <label className={labelClass}>Default Export Format</label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => handleChange("exportFormat", e.target.value)}
                  className={`${inputClass} max-w-xs`}
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
              <div className={`rounded-2xl p-4 ${isDark ? "bg-dark-bg" : "bg-very-light-grey"}`}>
                <p className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Storage Usage</p>
                <div className={`mt-2 h-3 overflow-hidden rounded-full ${isDark ? "bg-dark-border" : "bg-light-grey"}`}>
                  <div className="h-full w-3/5 rounded-full bg-primary-red" />
                </div>
                <p className={`mt-2 text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"}`}>2.4 GB of 4 GB used (60%)</p>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="space-y-5">
              <div className={cardClass}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Google Maps API</p>
                    <p className={subLabelClass}>For interactive flood maps</p>
                  </div>
                  <span className="rounded-full bg-status-green/20 px-2.5 py-1 text-xs font-semibold text-status-green">
                    Connected
                  </span>
                </div>
                <div className="mt-3">
                  <label className={`block text-xs font-medium ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"}`}>API Key</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="password"
                      value={settings.googleMapsApiKey}
                      onChange={(e) => handleChange("googleMapsApiKey", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => handleTestConnection("Google Maps")}
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold text-primary-red transition ${isDark ? "border-primary-red hover:bg-primary-red/20" : "border-primary-red hover:bg-light-red/20"}`}
                    >
                      Test
                    </button>
                  </div>
                </div>
              </div>
              <div className={cardClass}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>MongoDB Database</p>
                    <p className={subLabelClass}>Primary data storage</p>
                  </div>
                  <span className="rounded-full bg-status-green/20 px-2.5 py-1 text-xs font-semibold text-status-green">
                    Connected
                  </span>
                </div>
                <div className="mt-3">
                  <label className={`block text-xs font-medium ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"}`}>Connection URI</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="password"
                      value={settings.mongoDbUri}
                      onChange={(e) => handleChange("mongoDbUri", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => handleTestConnection("MongoDB")}
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold text-primary-red transition ${isDark ? "border-primary-red hover:bg-primary-red/20" : "border-primary-red hover:bg-light-red/20"}`}
                    >
                      Test
                    </button>
                  </div>
                </div>
              </div>
              <div className={cardClass}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Slack Integration</p>
                    <p className={subLabelClass}>Send alerts to Slack channels</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDark ? "bg-dark-border text-dark-text-muted" : "bg-very-light-grey text-dark-charcoal/60"}`}>
                    Not configured
                  </span>
                </div>
                <div className="mt-3">
                  <label className={`block text-xs font-medium ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"}`}>Webhook URL</label>
                  <input
                    type="text"
                    value={settings.slackWebhook}
                    onChange={(e) => handleChange("slackWebhook", e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Session Timeout</label>
                <p className={subLabelClass}>Auto-logout after inactivity</p>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
                    className={`${inputClass} w-32`}
                  />
                  <span className={`text-sm ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>minutes</span>
                </div>
              </div>
              <label className={`flex items-center justify-between ${cardClass}`}>
                <div>
                  <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Require Multi-Factor Authentication</p>
                  <p className={subLabelClass}>Enforce MFA for all users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireMfa}
                  onChange={(e) => handleChange("requireMfa", e.target.checked)}
                  className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                />
              </label>
              <label className={`flex items-center justify-between ${cardClass}`}>
                <div>
                  <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Audit Logging</p>
                  <p className={subLabelClass}>Log all user actions for compliance</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auditLogging}
                  onChange={(e) => handleChange("auditLogging", e.target.checked)}
                  className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                />
              </label>
              <div>
                <label className={labelClass}>IP Whitelist</label>
                <p className={subLabelClass}>Comma-separated IP addresses (leave empty to allow all)</p>
                <textarea
                  value={settings.ipWhitelist}
                  onChange={(e) => handleChange("ipWhitelist", e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.0/24"
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div className="rounded-2xl border border-status-warning-2/40 bg-status-warning-2/10 p-4">
                <p className="text-sm font-semibold text-status-warning-2">Security Recommendations</p>
                <ul className={`mt-2 space-y-1 text-xs ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/80"}`}>
                  <li>• Enable MFA for enhanced security</li>
                  <li>• Set session timeout to 30 minutes or less</li>
                  <li>• Configure IP whitelist for production environments</li>
                </ul>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Theme</label>
                <div className="mt-2 flex gap-3">
                  {["light", "dark", "system"].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => handleChange("theme", theme)}
                      className={`rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition ${
                        settings.theme === theme
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Primary Color</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className={`h-10 w-16 cursor-pointer rounded-lg border ${isDark ? "border-dark-border" : "border-light-grey"}`}
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className={`${inputClass} w-32`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Sidebar Position</label>
                <div className="mt-2 flex gap-3">
                  {["left", "right"].map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => handleChange("sidebarPosition", pos)}
                      className={`rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition ${
                        settings.sidebarPosition === pos
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <label className={`flex items-center justify-between ${cardClass}`}>
                <div>
                  <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Compact Mode</p>
                  <p className={subLabelClass}>Reduce spacing for more content</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => handleChange("compactMode", e.target.checked)}
                  className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                />
              </label>
            </div>
          )}

          {/* Map Settings Tab */}
          {activeTab === "map" && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Default Zoom Level</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={settings.defaultMapZoom}
                    onChange={(e) => handleChange("defaultMapZoom", parseInt(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Map Style</label>
                  <select
                    value={settings.mapStyle}
                    onChange={(e) => handleChange("mapStyle", e.target.value)}
                    className={inputClass}
                  >
                    <option value="satellite">Satellite</option>
                    <option value="roadmap">Roadmap</option>
                    <option value="terrain">Terrain</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Default Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={settings.defaultMapLat}
                    onChange={(e) => handleChange("defaultMapLat", parseFloat(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Default Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={settings.defaultMapLng}
                    onChange={(e) => handleChange("defaultMapLng", parseFloat(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
              <label className={`flex items-center justify-between ${cardClass}`}>
                <div>
                  <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Show Inactive Nodes</p>
                  <p className={subLabelClass}>Display offline sensors on map</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showInactiveNodes}
                  onChange={(e) => handleChange("showInactiveNodes", e.target.checked)}
                  className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                />
              </label>
              <div className={`rounded-2xl p-4 ${isDark ? "bg-dark-bg" : "bg-very-light-grey"}`}>
                <p className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Map Preview</p>
                <div className="mt-2 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-status-green/20 via-status-warning-1/20 to-primary-red/20">
                  <div className={`flex h-full items-center justify-center text-sm ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                    Map preview with current settings
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === "backup" && (
            <div className="space-y-5">
              <label className={`flex items-center justify-between ${cardClass}`}>
                <div>
                  <p className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Automatic Backups</p>
                  <p className={subLabelClass}>Schedule regular data backups</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleChange("autoBackup", e.target.checked)}
                  className="h-5 w-5 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleChange("backupFrequency", e.target.value)}
                    disabled={!settings.autoBackup}
                    className={`${inputClass} disabled:opacity-50`}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Retention Period</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="number"
                      value={settings.backupRetention}
                      onChange={(e) => handleChange("backupRetention", parseInt(e.target.value))}
                      disabled={!settings.autoBackup}
                      className={`${inputClass} disabled:opacity-50`}
                    />
                    <span className={`text-sm ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>days</span>
                  </div>
                </div>
              </div>
              <div className={cardClass}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>Last Backup</p>
                    <p className={subLabelClass}>
                      {new Date(settings.lastBackup).toLocaleString("en-MY", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackupNow}
                    className="rounded-xl bg-primary-red px-4 py-2 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
                  >
                    Backup Now
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    isDark
                      ? "border-dark-border text-dark-text hover:bg-dark-bg"
                      : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                  }`}
                >
                  Download Backup
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-status-warning-2 px-4 py-3 text-sm font-semibold text-status-warning-2 transition hover:bg-status-warning-2/10"
                >
                  Restore from Backup
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`mt-8 flex justify-end gap-3 border-t pt-6 ${isDark ? "border-dark-border" : "border-light-grey"}`}>
            <button
              type="button"
              onClick={handleReset}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                isDark
                  ? "border-dark-border text-dark-text hover:bg-dark-bg"
                  : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
              }`}
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={!hasChanges}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark
                  ? "border-dark-border text-dark-text hover:bg-dark-bg"
                  : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
