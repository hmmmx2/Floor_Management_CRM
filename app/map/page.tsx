"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import NodeMap from "@/components/map/NodeMap";
import { useTheme } from "@/lib/ThemeContext";
import { NodeData } from "@/lib/types";

// Status legend data
const statusLegend = [
  {
    label: "Safe",
    description: "No flood risk",
    water_level: 0,
    color: "bg-status-green text-pure-white",
  },
  {
    label: "Alert",
    description: "Minor flooding possible",
    water_level: 1,
    color: "bg-status-warning-1 text-dark-charcoal",
  },
  {
    label: "Warning",
    description: "Moderate flood risk",
    water_level: 2,
    color: "bg-status-warning-2 text-pure-white",
  },
  {
    label: "Danger",
    description: "Severe flooding",
    water_level: 3,
    color: "bg-status-danger text-pure-white",
  },
];

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

export default function FloodMapPage() {
  const { isDark } = useTheme();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Read global settings from CRM Settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("crmSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        setAutoRefresh(settings.liveDataEnabled ?? true);
        setRefreshInterval(settings.refreshInterval ?? 30000);
      }
    };
    loadSettings();
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  // Fetch nodes data from API
  const fetchNodes = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }

      const result = await response.json();

      if (result.success) {
        setNodes(result.data);
        setLastFetch(new Date());
        setError(null);
      } else {
        throw new Error(result.error || "Failed to fetch nodes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchNodes();

    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchNodes, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNodes, autoRefresh, refreshInterval]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: nodes.length,
      online: nodes.filter((n) => !n.is_dead).length,
      offline: nodes.filter((n) => n.is_dead).length,
      normal: nodes.filter((n) => n.current_level === 0).length,
      alert: nodes.filter((n) => n.current_level === 1).length,
      warning: nodes.filter((n) => n.current_level === 2).length,
      critical: nodes.filter((n) => n.current_level === 3).length,
    };
  }, [nodes]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`h-12 w-12 animate-spin rounded-full border-4 ${isDark ? "border-dark-border border-t-primary-red" : "border-light-grey border-t-primary-red"}`} />
            <p className={`text-sm font-medium ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
              Loading map data...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className={`rounded-3xl border p-8 text-center ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-red/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary-red">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Connection Error
            </h2>
            <p className={`text-sm mb-4 ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              {error}
            </p>
            <button
              type="button"
              onClick={fetchNodes}
              className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            Flood Map
          </h1>
          <p className={`text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            Real-time sensor locations from MongoDB. Hover markers to inspect node details.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Live status indicator */}
          {lastFetch && (
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-status-green animate-pulse" : "bg-dark-charcoal/40"}`} />
              <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                {autoRefresh ? "Live" : "Paused"} | Updated: {lastFetch.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Manual refresh */}
          <button
            type="button"
            onClick={fetchNodes}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isDark
                ? "border-dark-border text-dark-text hover:border-primary-red hover:text-primary-red"
                : "border-light-grey text-dark-charcoal hover:border-primary-red hover:text-primary-red"
            }`}
            title="Refresh data"
          >
            <RefreshIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]">
        <article className={`rounded-3xl border p-5 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={`text-xs uppercase tracking-wide transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                Live View
              </p>
              <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                IoT Nodes from MongoDB
              </h2>
            </div>
            <div className={`flex items-center gap-4 text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              <span>
                Online: <span className="text-status-green">{stats.online}</span>
              </span>
              <span>
                Offline: <span className="text-primary-red">{stats.offline}</span>
              </span>
            </div>
          </div>
          <div className={`mt-4 rounded-3xl border transition-colors ${isDark ? "border-dark-border" : "border-light-grey"}`}>
            <NodeMap nodes={nodes} height={460} zoom={12} focusOnLatest={true} />
          </div>
          <div className={`mt-4 flex flex-wrap items-center gap-4 text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            <span className={`font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Water Level Status:
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-status-green" /> Normal ({stats.normal})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-status-warning-1" /> Alert ({stats.alert})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-status-warning-2" /> Warning ({stats.warning})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-status-danger" /> Critical ({stats.critical})
            </span>
          </div>
        </article>

        <article className={`rounded-3xl border p-5 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            Status Legend
          </h2>
          <p className={`text-xs transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            Every pin follows the Sarawak flood SOP levels.
          </p>
          <ul className="mt-4 space-y-3">
            {statusLegend.map((legend) => (
              <li
                key={legend.label}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${isDark ? "border-dark-border bg-dark-bg" : "border-light-grey"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${legend.color}`}>
                    {legend.water_level}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                      {legend.label}
                    </p>
                    <p className={`text-xs transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
                      {legend.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary-red">
                  LVL {legend.water_level}
                </span>
              </li>
            ))}
          </ul>

          {/* Node List */}
          <div className={`mt-6 rounded-2xl px-4 py-3 transition-colors ${isDark ? "bg-dark-bg" : "bg-very-light-grey"}`}>
            <p className={`font-semibold uppercase tracking-wide text-xs transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Recent Nodes
            </p>
            <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
              {nodes.slice(0, 10).map((node) => (
                <div
                  key={node._id}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${isDark ? "bg-dark-card" : "bg-pure-white"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        node.is_dead
                          ? "bg-status-danger"
                          : node.current_level === 0
                            ? "bg-status-green"
                            : node.current_level === 1
                              ? "bg-status-warning-1"
                              : node.current_level === 2
                                ? "bg-status-warning-2"
                                : "bg-status-danger"
                      }`}
                    />
                    <span className={`font-medium ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                      {node.node_id}
                    </span>
                  </div>
                  <span className={`${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                    {node.current_level}ft
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-4 rounded-2xl px-4 py-3 text-xs transition-colors ${isDark ? "bg-dark-bg text-dark-text-secondary" : "bg-very-light-grey text-dark-charcoal/70"}`}>
            <p className={`font-semibold uppercase tracking-wide transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Map Info
            </p>
            <p>Total Nodes: {stats.total} | Online: {stats.online} | Offline: {stats.offline}</p>
            <p>Data refreshes every 5 seconds when live mode is enabled.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
