"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import OverviewCard from "@/components/cards/OverviewCard";
import StatusPill from "@/components/common/StatusPill";
import NodeMap from "@/components/map/NodeMap";
import {
  alertRecords,
  floodTotalsByState,
  recentActivity,
  trendSeriesMonthly,
} from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";
import { NodeData, getStatusLabel } from "@/lib/types";

// ─── Derived data for Recharts ───────────────────────────────────────────────
const lineChartData = trendSeriesMonthly.map((pt) => ({
  name: pt.label,
  waterLevel: pt.value,
}));

const stateBarData = floodTotalsByState.map((s) => ({
  name: s.state,
  total: s.total,
  critical: s.critical,
}));

export default function DashboardPage() {
  const { isDark } = useTheme();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  
  // Read global settings from CRM Settings
  const [liveDataEnabled, setLiveDataEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("crmSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        setLiveDataEnabled(settings.liveDataEnabled ?? true);
        setRefreshInterval(settings.refreshInterval ?? 30000);
      }
    };
    loadSettings();
    // Listen for storage changes from other tabs/pages
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
      }
    } catch (error) {
      console.error("Error fetching nodes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchNodes();
    let interval: NodeJS.Timeout | null = null;
    if (liveDataEnabled) {
      interval = setInterval(fetchNodes, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNodes, liveDataEnabled, refreshInterval]);

  // Statistics from real-time data
  const stats = useMemo(() => {
    const totalNodes = nodes.length;
    const activeNodes = nodes.filter((n) => !n.is_dead).length;
    const inactiveNodes = nodes.filter((n) => n.is_dead).length;
    const criticalNodes = nodes.filter((n) => n.current_level === 3).length;
    const warningNodes = nodes.filter((n) => n.current_level === 2).length;
    const alertNodes = nodes.filter((n) => n.current_level === 1).length;
    const normalNodes = nodes.filter((n) => n.current_level === 0).length;
    const avgWaterLevel = totalNodes > 0 
      ? nodes.reduce((acc, n) => acc + n.current_level, 0) / totalNodes 
      : 0;
    const riskiestNode = nodes.reduce((prev, current) => 
      (current.current_level > (prev?.current_level ?? -1)) ? current : prev
    , nodes[0]);

    return {
      totalNodes,
      activeNodes,
      inactiveNodes,
      criticalNodes,
      warningNodes,
      alertNodes,
      normalNodes,
      avgWaterLevel,
      riskiestNode,
    };
  }, [nodes]);

  // Bar chart data from real-time nodes
  const barChartData = useMemo(() => {
    return nodes.slice(0, 10).map((n) => ({
      name: n.node_id.slice(-4),
      level: n.current_level,
    }));
  }, [nodes]);

  // Chart colors based on theme
  const chartTextColor = isDark ? "#a0a0a0" : "#4E4B4B";
  const chartGridColor = isDark ? "#2d3a5a" : "#E5E5E5";
  const tooltipBg = isDark ? "#16213e" : "#ffffff";
  const tooltipBorder = isDark ? "#2d3a5a" : "#BFBFBF";

  const criticalAlerts = alertRecords.filter(
    (alert) => alert.alert_type === "DANGER"
  ).length;
  const warningAlerts = alertRecords.filter(
    (alert) => alert.alert_type === "WARNING"
  ).length;

  // Get status variant for StatusPill
  const getStatusVariant = (level: number): "green" | "yellow" | "orange" | "red" => {
    switch (level) {
      case 0: return "green";
      case 1: return "yellow";
      case 2: return "orange";
      case 3: return "red";
      default: return "green";
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className={`text-3xl font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Dashboard
          </h1>
          <p
            className={`text-sm transition-colors ${
              isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
            }`}
          >
            Live situational awareness from MongoDB — Real-time flood monitoring.
          </p>
        </div>
        {lastFetch && (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${liveDataEnabled ? "bg-status-green animate-pulse" : "bg-dark-charcoal/40"}`} />
            <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              {liveDataEnabled ? "Live" : "Paused"} | Updated: {lastFetch.toLocaleTimeString()}
            </span>
          </div>
        )}
      </header>

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Total Nodes"
          value={isLoading ? "..." : String(stats.totalNodes)}
          helper={`${stats.activeNodes} online / ${stats.inactiveNodes} offline`}
          trend={{ label: "From MongoDB", direction: "up" }}
        />
        <OverviewCard
          title="Water Level Status"
          value={isLoading ? "..." : `${stats.criticalNodes + stats.warningNodes}`}
          helper={`${stats.criticalNodes} critical / ${stats.warningNodes} warning`}
          trend={{ label: "Real-time", direction: stats.criticalNodes > 0 ? "down" : "flat" }}
        />
        <OverviewCard
          title="Riskiest Node"
          value={isLoading || !stats.riskiestNode ? "..." : stats.riskiestNode.node_id.slice(-6)}
          subLabel={stats.riskiestNode ? `${stats.riskiestNode.current_level}ft water level` : ""}
          trend={{
            label: stats.riskiestNode ? getStatusLabel(stats.riskiestNode.current_level) : "",
            direction: "down",
          }}
        />
        <OverviewCard
          title="Average Water Level"
          value={isLoading ? "..." : `${stats.avgWaterLevel.toFixed(1)}ft`}
          helper={`${stats.normalNodes} normal / ${stats.alertNodes} alert`}
          trend={{ label: "Live data", direction: "flat" }}
        />
      </div>

      {/* ─── Table + Map Row ────────────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <article
          className={`rounded-3xl border p-5 shadow-sm transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-light-grey bg-pure-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-lg font-semibold transition-colors ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Nodes from MongoDB
              </h2>
              <p
                className={`text-xs uppercase tracking-wide transition-colors ${
                  isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                }`}
              >
                Live device telemetry
              </p>
            </div>
            <span className="rounded-full bg-light-red px-4 py-1 text-xs font-semibold text-primary-red dark:bg-primary-red/20">
              {nodes.length} nodes
            </span>
          </div>
          <div className="mt-4 overflow-x-auto max-h-[320px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className={`h-8 w-8 animate-spin rounded-full border-4 ${isDark ? "border-dark-border border-t-primary-red" : "border-light-grey border-t-primary-red"}`} />
              </div>
            ) : (
              <table
                className={`min-w-full text-left text-sm transition-colors ${
                  isDark ? "text-dark-text-secondary" : "text-dark-charcoal"
                }`}
              >
                <thead
                  className={`text-xs uppercase transition-colors sticky top-0 ${
                    isDark
                      ? "bg-dark-bg text-dark-text-muted"
                      : "bg-light-red text-dark-charcoal"
                  }`}
                >
                  <tr>
                    <th className="px-4 py-3 font-semibold">Node ID</th>
                    <th className="px-4 py-3 font-semibold">Water Level</th>
                    <th className="px-4 py-3 font-semibold">Coordinates</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Node Status</th>
                    <th className="px-4 py-3 font-semibold">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node) => (
                    <tr
                      key={node._id}
                      className={`border-b last:border-b-0 transition-colors ${
                        isDark
                          ? "border-dark-border hover:bg-dark-bg"
                          : "border-light-red/60 hover:bg-light-red/20"
                      }`}
                    >
                      <td
                        className={`px-4 py-3 font-semibold transition-colors ${
                          isDark ? "text-dark-text" : "text-dark-charcoal"
                        }`}
                      >
                        {node.node_id}
                      </td>
                      <td className="px-4 py-3 text-primary-red font-bold">
                        {node.current_level} ft
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {node.latitude.toFixed(4)}°N, {node.longitude.toFixed(4)}°E
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill 
                          status={getStatusLabel(node.current_level)} 
                          variant={getStatusVariant(node.current_level)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          node.is_dead
                            ? "bg-status-danger/20 text-status-danger"
                            : "bg-status-green/20 text-status-green"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${node.is_dead ? "bg-status-danger" : "bg-status-green"}`} />
                          {node.is_dead ? "Offline" : "Online"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(node.last_updated).toLocaleString("en-MY", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>

        <article
          className={`rounded-3xl border p-5 shadow-sm transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-light-grey bg-pure-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-lg font-semibold transition-colors ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Hotspot Map
              </h2>
              <p
                className={`text-xs transition-colors ${
                  isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
                }`}
              >
                Real-time sensor locations from MongoDB
              </p>
            </div>
            <span className="text-sm font-semibold text-primary-red">
              Online: {stats.activeNodes}
            </span>
          </div>
          <div
            className={`mt-4 rounded-2xl border transition-colors ${
              isDark ? "border-dark-border" : "border-light-grey"
            }`}
          >
            <NodeMap nodes={nodes} height={280} zoom={12} />
          </div>
          <ul
            className={`mt-4 grid grid-cols-2 gap-3 text-xs font-semibold transition-colors ${
              isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
            }`}
          >
            <li
              className={`rounded-2xl border px-3 py-2 transition-colors ${
                isDark
                  ? "border-dark-border bg-dark-bg"
                  : "border-light-grey bg-very-light-grey"
              }`}
            >
              Critical (3ft):{" "}
              <span className="text-primary-red">{stats.criticalNodes}</span>
            </li>
            <li
              className={`rounded-2xl border px-3 py-2 transition-colors ${
                isDark
                  ? "border-dark-border bg-dark-bg"
                  : "border-light-grey bg-very-light-grey"
              }`}
            >
              Warning (2ft):{" "}
              <span className="text-status-warning-2">{stats.warningNodes}</span>
            </li>
            <li
              className={`rounded-2xl border px-3 py-2 transition-colors ${
                isDark
                  ? "border-dark-border bg-dark-bg"
                  : "border-light-grey bg-very-light-grey"
              }`}
            >
              Alert (1ft):{" "}
              <span className="text-status-warning-1">{stats.alertNodes}</span>
            </li>
            <li
              className={`rounded-2xl border px-3 py-2 transition-colors ${
                isDark
                  ? "border-dark-border bg-dark-bg"
                  : "border-light-grey bg-very-light-grey"
              }`}
            >
              Normal (0ft):{" "}
              <span className="text-status-green">{stats.normalNodes}</span>
            </li>
          </ul>
        </article>
      </div>

      {/* ─── Time Series + Recent Activity ──────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <article
          className={`rounded-3xl border p-5 shadow-sm lg:col-span-2 transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-light-grey bg-pure-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-lg font-semibold transition-colors ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Time Series Analysis
              </h2>
              <p
                className={`text-xs uppercase tracking-wide transition-colors ${
                  isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                }`}
              >
                Monthly average water level (ft)
              </p>
            </div>
            <span className="rounded-full bg-light-red/70 px-3 py-1 text-xs font-semibold text-primary-red dark:bg-primary-red/20">
              Monthly
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData}>
                <defs>
                  <linearGradient id="colorWaterDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ED1C24" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ED1C24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Month",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: chartTextColor,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "dataMax + 0.5"]}
                  label={{
                    value: "Water Level (ft)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: chartTextColor,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${tooltipBorder}`,
                    fontSize: 12,
                    backgroundColor: tooltipBg,
                    color: isDark ? "#e8e8e8" : "#4E4B4B",
                  }}
                  formatter={(value: number) => [`${value} ft`, "Water Level"]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, fontWeight: 500, color: chartTextColor }}
                />
                <Area
                  type="monotone"
                  dataKey="waterLevel"
                  name="Water Level"
                  stroke="#ED1C24"
                  strokeWidth={2}
                  fill="url(#colorWaterDash)"
                  dot={{ r: 4, fill: "#ED1C24" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article
          className={`rounded-3xl border p-5 shadow-sm transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-light-grey bg-pure-white"
          }`}
        >
          <h2
            className={`text-lg font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Recent Activity
          </h2>
          <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((item) => (
              <li
                key={item.id}
                className={`rounded-2xl border px-4 py-3 transition-colors ${
                  isDark ? "border-dark-border bg-dark-bg" : "border-light-grey"
                }`}
              >
                <p className="text-sm font-semibold text-primary-red">
                  {item.alert_type}
                </p>
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  {item.message} ({item.area})
                </p>
                <p
                  className={`text-xs transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  {new Date(item.timestamp).toLocaleString("en-MY", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* ─── Bar Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Water Level by Node – Vertical Bar */}
        <article
          className={`rounded-3xl border p-5 shadow-sm transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-light-grey bg-pure-white"
          }`}
        >
          <h2
            className={`text-lg font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Water Level by Node ID
          </h2>
          <p
            className={`text-xs uppercase tracking-wide transition-colors ${
              isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
            }`}
          >
            Real-time readings from MongoDB (ft)
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Node ID",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: chartTextColor,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 4]}
                  label={{
                    value: "Water Level (ft)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: chartTextColor,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${tooltipBorder}`,
                    fontSize: 12,
                    backgroundColor: tooltipBg,
                    color: isDark ? "#e8e8e8" : "#4E4B4B",
                  }}
                  formatter={(value: number) => [`${value} ft`, "Water Level"]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="square"
                  wrapperStyle={{ fontSize: 12, fontWeight: 500, color: chartTextColor }}
                />
                <Bar
                  dataKey="level"
                  name="Water Level"
                  fill="#ED1C24"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Total Flood by State – Horizontal Bar */}
        <article
          className={`rounded-3xl border p-5 shadow-sm transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-light-grey bg-pure-white"
          }`}
        >
          <h2
            className={`text-lg font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Total Flood by State
          </h2>
          <p
            className={`text-xs uppercase tracking-wide transition-colors ${
              isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
            }`}
          >
            Total vs Critical incidents
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateBarData} layout="vertical" barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Number of Incidents",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: chartTextColor,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: chartTextColor }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${tooltipBorder}`,
                    fontSize: 12,
                    backgroundColor: tooltipBg,
                    color: isDark ? "#e8e8e8" : "#4E4B4B",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="square"
                  wrapperStyle={{ fontSize: 12, fontWeight: 500, color: chartTextColor }}
                />
                <Bar
                  dataKey="total"
                  name="Total Incidents"
                  fill="#ED1C24"
                  radius={[0, 6, 6, 0]}
                />
                <Bar
                  dataKey="critical"
                  name="Critical Incidents"
                  fill="#FF9F1C"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}
