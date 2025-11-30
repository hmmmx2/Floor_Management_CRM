"use client";

import { useMemo, useState } from "react";

import { alertRecords, type AlertType } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      fill="currentColor"
      {...props}
    >
      <path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z" />
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

const typeFilterOptions = [
  { id: "all", label: "All Alerts" },
  { id: "danger", label: "Danger Only" },
  { id: "warning", label: "Warning Only" },
  { id: "inactive", label: "Inactive" },
  { id: "newnode", label: "New Nodes" },
];

const timePeriodOptions = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

const sortOrderOptions = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "safe-to-warning", label: "Safe → Warning" },
  { id: "warning-to-safe", label: "Warning → Safe" },
];

const alertTone = {
  DANGER: {
    border: "border-primary-red",
    background: "bg-light-red/60 dark:bg-primary-red/20",
    label: "text-primary-red",
  },
  WARNING: {
    border: "border-status-warning-2",
    background: "bg-status-warning-2/15 dark:bg-status-warning-2/25",
    label: "text-status-warning-2",
  },
  "NEW NODE": {
    // Light blue theme for new nodes
    border: "border-blue",
    background: "bg-light-blue dark:bg-blue/20",
    label: "text-blue",
  },
  INACTIVE: {
    // Light purple theme for inactive nodes
    border: "border-purple",
    background: "bg-light-purple dark:bg-purple/20",
    label: "text-purple",
  },
};

// Map alert types to a numeric severity for sorting
const alertSeverity: Record<AlertType, number> = {
  DANGER: 4,
  WARNING: 3,
  INACTIVE: 2,
  "NEW NODE": 1,
};

export default function AlertsPage() {
  const { isDark } = useTheme();
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredAndSortedAlerts = useMemo(() => {
    let subset = [...alertRecords];

    // Filter by alert type
    if (activeTypeFilter === "danger") {
      subset = subset.filter((alert) => alert.alert_type === "DANGER");
    } else if (activeTypeFilter === "warning") {
      subset = subset.filter((alert) => alert.alert_type === "WARNING");
    } else if (activeTypeFilter === "inactive") {
      subset = subset.filter((alert) => alert.alert_type === "INACTIVE");
    } else if (activeTypeFilter === "newnode") {
      subset = subset.filter((alert) => alert.alert_type === "NEW NODE");
    }

    // Filter by time period
    const now = new Date();
    subset = subset.filter((alert) => {
      const alertDate = new Date(alert.timestamp);
      const diffMs = now.getTime() - alertDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      switch (timePeriod) {
        case "daily":
          return diffDays <= 1;
        case "weekly":
          return diffDays <= 7;
        case "monthly":
          return diffDays <= 30;
        case "yearly":
          return diffDays <= 365;
        default:
          return true;
      }
    });

    // Sort alerts
    subset.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();

      switch (sortOrder) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "safe-to-warning":
          return alertSeverity[a.alert_type] - alertSeverity[b.alert_type];
        case "warning-to-safe":
          return alertSeverity[b.alert_type] - alertSeverity[a.alert_type];
        default:
          return dateB - dateA;
      }
    });

    return {
      recent: subset.filter((alert) => alert.category === "recent"),
      lastWeek: subset.filter((alert) => alert.category === "lastWeek"),
    };
  }, [activeTypeFilter, timePeriod, sortOrder]);

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setActiveTypeFilter("all");
    setTimePeriod("weekly");
    setSortOrder("newest");
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className={`text-3xl font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Alerts Monitoring
          </h1>
          <p
            className={`text-sm transition-colors ${
              isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
            }`}
          >
            Triage danger, warning, new node, and inactive signals as they land.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            isDark
              ? "border-dark-border text-dark-text hover:border-primary-red hover:text-primary-red"
              : "border-light-grey text-dark-charcoal hover:border-primary-red hover:text-primary-red"
          }`}
        >
          <FilterIcon className="h-4 w-4" />
          Filter
          {(activeTypeFilter !== "all" ||
            timePeriod !== "weekly" ||
            sortOrder !== "newest") && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-red text-xs text-pure-white">
              !
            </span>
          )}
        </button>
      </header>

      {/* Quick Type Filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilterOptions.map((option) => {
          const isActive = option.id === activeTypeFilter;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveTypeFilter(option.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                isActive
                  ? "bg-primary-red text-pure-white"
                  : isDark
                    ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                    : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Active Filters Summary */}
      <div
        className={`flex flex-wrap items-center gap-2 text-sm transition-colors ${
          isDark ? "text-dark-text-secondary" : "text-dark-charcoal/60"
        }`}
      >
        <span>Showing:</span>
        <span className="rounded-full bg-light-red/40 px-3 py-1 text-xs font-semibold text-primary-red dark:bg-primary-red/20">
          {timePeriodOptions.find((t) => t.id === timePeriod)?.label}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            isDark ? "bg-dark-bg text-dark-text" : "bg-very-light-grey text-dark-charcoal"
          }`}
        >
          {sortOrderOptions.find((s) => s.id === sortOrder)?.label}
        </span>
        <span>
          · {filteredAndSortedAlerts.recent.length + filteredAndSortedAlerts.lastWeek.length} total alerts
        </span>
      </div>

      {/* Recently Section */}
      <section
        className={`space-y-4 rounded-3xl border p-5 shadow-sm transition-colors ${
          isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Recently
          </h2>
          <span
            className={`text-xs uppercase tracking-wide transition-colors ${
              isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
            }`}
          >
            {filteredAndSortedAlerts.recent.length} records
          </span>
        </div>
        <div className="space-y-3">
          {filteredAndSortedAlerts.recent.map((alert) => {
            const tone = alertTone[alert.alert_type as keyof typeof alertTone];
            return (
              <article
                key={alert.id}
                className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
              >
                <p className={`text-base font-semibold ${tone.label}`}>
                  {alert.alert_type}!
                </p>
                <p
                  className={`text-sm font-semibold transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  Node {alert.node_reference.replace("node_", "")} · Water Level:{" "}
                  {alert.water_level} ft
                </p>
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-dark-text-secondary" : "text-dark-charcoal/80"
                  }`}
                >
                  {alert.area}
                </p>
                <p
                  className={`text-xs transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  {new Date(alert.timestamp).toLocaleString("en-MY", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p
                  className={`mt-2 text-sm transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  {alert.message}
                </p>
              </article>
            );
          })}
          {filteredAndSortedAlerts.recent.length === 0 && (
            <p
              className={`text-sm font-semibold transition-colors ${
                isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"
              }`}
            >
              No alerts match the selected filter.
            </p>
          )}
        </div>
      </section>

      {/* Last Week Section */}
      <section
        className={`space-y-4 rounded-3xl border p-5 shadow-sm transition-colors ${
          isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Last Week
          </h2>
          <span
            className={`text-xs uppercase tracking-wide transition-colors ${
              isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
            }`}
          >
            {filteredAndSortedAlerts.lastWeek.length} records
          </span>
        </div>
        <div className="space-y-3">
          {filteredAndSortedAlerts.lastWeek.map((alert) => {
            const tone = alertTone[alert.alert_type as keyof typeof alertTone];
            return (
              <article
                key={alert.id}
                className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
              >
                <p className={`text-base font-semibold ${tone.label}`}>
                  {alert.alert_type}!
                </p>
                <p
                  className={`text-sm font-semibold transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  Node {alert.node_reference.replace("node_", "")} · Water Level:{" "}
                  {alert.water_level} ft
                </p>
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-dark-text-secondary" : "text-dark-charcoal/80"
                  }`}
                >
                  {alert.area}
                </p>
                <p
                  className={`text-xs transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  {new Date(alert.timestamp).toLocaleDateString("en-MY", {
                    dateStyle: "medium",
                  })}
                </p>
                <p
                  className={`mt-2 text-sm transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  {alert.message}
                </p>
              </article>
            );
          })}
          {filteredAndSortedAlerts.lastWeek.length === 0 && (
            <p
              className={`text-sm font-semibold transition-colors ${
                isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"
              }`}
            >
              Nothing to show here for now.
            </p>
          )}
        </div>
      </section>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/60 p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-xl transition-colors ${
              isDark ? "bg-dark-card" : "bg-pure-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-xl font-semibold transition-colors ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Filter Alerts
              </h2>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className={`rounded-full p-2 transition-colors ${
                  isDark
                    ? "text-dark-text-muted hover:bg-dark-bg hover:text-dark-text"
                    : "text-dark-charcoal/60 hover:bg-very-light-grey hover:text-dark-charcoal"
                }`}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Time Period */}
              <div>
                <label
                  className={`block text-sm font-semibold transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  Time Period
                </label>
                <p
                  className={`text-xs transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  Filter alerts by time range
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {timePeriodOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTimePeriod(option.id)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        timePeriod === option.id
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label
                  className={`block text-sm font-semibold transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  Sort Order
                </label>
                <p
                  className={`text-xs transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  Order alerts by date or severity
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {sortOrderOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSortOrder(option.id)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        sortOrder === option.id
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Type */}
              <div>
                <label
                  className={`block text-sm font-semibold transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  Alert Type
                </label>
                <p
                  className={`text-xs transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  Show specific alert types
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeFilterOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setActiveTypeFilter(option.id)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                        activeTypeFilter === option.id
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                  isDark
                    ? "border-dark-border text-dark-text-secondary hover:bg-dark-bg"
                    : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                }`}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
