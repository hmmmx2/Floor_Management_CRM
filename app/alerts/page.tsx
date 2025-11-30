"use client";

import { useMemo, useState } from "react";

import FilterIcon from "@/app/images/filter.svg";
import { alertRecords } from "@/lib/data";

const filterOptions = [
  { id: "latest", label: "Latest" },
  { id: "recent", label: "Recent" },
  { id: "danger", label: "Danger Only" },
];

const alertTone = {
  DANGER: {
    border: "border-primary-red",
    background: "bg-light-red/60",
    label: "text-primary-red",
  },
  WARNING: {
    border: "border-status-warning-2",
    background: "bg-status-warning-2/15",
    label: "text-status-warning-2",
  },
  "NEW NODE": {
    border: "border-status-green",
    background: "bg-status-green/15",
    label: "text-status-green",
  },
  INACTIVE: {
    border: "border-light-grey",
    background: "bg-very-light-grey",
    label: "text-dark-charcoal",
  },
};

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState("latest");

  const alertsBySection = useMemo(() => {
    let subset = alertRecords;

    if (activeFilter === "latest") {
      subset = alertRecords.slice(0, 3);
    } else if (activeFilter === "recent") {
      subset = alertRecords.filter((alert) => alert.category === "recent");
    } else if (activeFilter === "danger") {
      subset = alertRecords.filter((alert) => alert.alert_type === "DANGER");
    }

    return {
      recent: subset.filter((alert) => alert.category === "recent"),
      lastWeek: subset.filter((alert) => alert.category === "lastWeek"),
    };
  }, [activeFilter]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-dark-charcoal">
            Alerts Monitoring
          </h1>
          <p className="text-sm text-dark-charcoal/70">
            Triage danger, warning, new node, and inactive signals as they land.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-light-grey px-4 py-2 text-sm font-semibold text-dark-charcoal transition hover:border-primary-red hover:text-primary-red"
        >
          <FilterIcon className="h-4 w-4" />
          Filter
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = option.id === activeFilter;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveFilter(option.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                isActive
                  ? "bg-primary-red text-pure-white"
                  : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <section className="space-y-4 rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark-charcoal">Recently</h2>
          <span className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            {alertsBySection.recent.length} records
          </span>
        </div>
        <div className="space-y-3">
          {alertsBySection.recent.map((alert) => {
            const tone = alertTone[alert.alert_type as keyof typeof alertTone];
            return (
              <article
                key={alert.id}
                className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
              >
                <p className={`text-base font-semibold ${tone.label}`}>
                  {alert.alert_type}!
                </p>
                <p className="text-sm font-semibold text-dark-charcoal">
                  Node {alert.node_reference.replace("node_", "")} · Water Level:{" "}
                  {alert.water_level} ft
                </p>
                <p className="text-sm text-dark-charcoal/80">{alert.area}</p>
                <p className="text-xs text-dark-charcoal/60">
                  {new Date(alert.timestamp).toLocaleString("en-MY", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="mt-2 text-sm text-dark-charcoal">{alert.message}</p>
              </article>
            );
          })}
          {alertsBySection.recent.length === 0 && (
            <p className="text-sm font-semibold text-dark-charcoal/70">
              No alerts match the selected filter.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark-charcoal">Last Week</h2>
          <span className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            {alertsBySection.lastWeek.length} records
          </span>
        </div>
        <div className="space-y-3">
          {alertsBySection.lastWeek.map((alert) => {
            const tone = alertTone[alert.alert_type as keyof typeof alertTone];
            return (
              <article
                key={alert.id}
                className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
              >
                <p className={`text-base font-semibold ${tone.label}`}>
                  {alert.alert_type}!
                </p>
                <p className="text-sm font-semibold text-dark-charcoal">
                  Node {alert.node_reference.replace("node_", "")} · Water Level:{" "}
                  {alert.water_level} ft
                </p>
                <p className="text-sm text-dark-charcoal/80">{alert.area}</p>
                <p className="text-xs text-dark-charcoal/60">
                  {new Date(alert.timestamp).toLocaleDateString("en-MY", {
                    dateStyle: "medium",
                  })}
                </p>
                <p className="mt-2 text-sm text-dark-charcoal">{alert.message}</p>
              </article>
            );
          })}
          {alertsBySection.lastWeek.length === 0 && (
            <p className="text-sm font-semibold text-dark-charcoal/70">
              Nothing to show here for now.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

