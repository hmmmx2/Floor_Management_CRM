"use client";

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
  nodes,
  recentActivity,
  trendSeriesMonthly,
  waterLevelByNode,
} from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

// ─── Derived data for Recharts ───────────────────────────────────────────────
const lineChartData = trendSeriesMonthly.map((pt) => ({
  name: pt.label,
  waterLevel: pt.value,
}));

const barChartData = waterLevelByNode.map((n) => ({
  name: n.label.replace("Node No. ", "N"),
  level: n.value,
}));

const stateBarData = floodTotalsByState.map((s) => ({
  name: s.state,
  total: s.total,
  critical: s.critical,
}));

export default function DashboardPage() {
  const { isDark } = useTheme();

  const totalNodes = nodes.length;
  const activeNodes = nodes.filter((node) => node.is_active).length;
  const criticalAlerts = alertRecords.filter(
    (alert) => alert.alert_type === "DANGER"
  ).length;
  const warningAlerts = alertRecords.filter(
    (alert) => alert.alert_type === "WARNING"
  ).length;
  const averageWaterLevel =
    nodes.reduce((acc, node) => acc + node.water_level, 0) / totalNodes;
  const riskiestNode = nodes.reduce((prev, current) =>
    current.water_level > prev.water_level ? current : prev
  );

  // Chart colors based on theme
  const chartTextColor = isDark ? "#a0a0a0" : "#4E4B4B";
  const chartGridColor = isDark ? "#2d3a5a" : "#E5E5E5";
  const tooltipBg = isDark ? "#16213e" : "#ffffff";
  const tooltipBorder = isDark ? "#2d3a5a" : "#BFBFBF";

  return (
    <section className="space-y-6">
      <header>
        <h1
          className={`text-3xl font-semibold ${
            isDark ? "text-dark-text" : "text-dark-charcoal"
          }`}
        >
          Dashboard
        </h1>
        <p
          className={`text-sm ${
            isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
          }`}
        >
          Live situational awareness for Sarawak flood defences.
        </p>
      </header>

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Total Nodes"
          value={String(totalNodes)}
          helper={`${activeNodes} active`}
          trend={{ label: "+3% vs last month", direction: "up" }}
        />
        <OverviewCard
          title="Current Alerts"
          value={`${criticalAlerts + warningAlerts}`}
          helper={`${criticalAlerts} danger / ${warningAlerts} warning`}
          trend={{ label: "Monitoring", direction: "flat" }}
        />
        <OverviewCard
          title="Riskiest Area"
          value={riskiestNode.area.split(",")[0]}
          subLabel={riskiestNode.state}
          trend={{
            label: `Node ${riskiestNode.node_id.split("_")[1]}`,
            direction: "down",
          }}
        />
        <OverviewCard
          title="Average Water Level"
          value={`<${(averageWaterLevel * 30).toFixed(0)}cm`}
          helper={`${averageWaterLevel.toFixed(1)} ft avg`}
          trend={{ label: "-0.2 ft today", direction: "down" }}
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
                className={`text-lg font-semibold ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Nodes by Area
              </h2>
              <p
                className={`text-xs uppercase tracking-wide ${
                  isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                }`}
              >
                Live device telemetry
              </p>
            </div>
            <span className="rounded-full bg-light-red px-4 py-1 text-xs font-semibold text-primary-red">
              Updated just now
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead
                className={`text-xs uppercase ${
                  isDark
                    ? "bg-dark-border text-dark-text"
                    : "bg-light-red text-dark-charcoal"
                }`}
              >
                <tr>
                  <th className="px-4 py-3 font-semibold">Node ID</th>
                  <th className="px-4 py-3 font-semibold">Water Level</th>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Last Update</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <tr
                    key={node.node_id}
                    className={`border-b last:border-b-0 ${
                      isDark ? "border-dark-border" : "border-light-red/60"
                    }`}
                  >
                    <td
                      className={`px-4 py-3 font-semibold ${
                        isDark ? "text-dark-text" : "text-dark-charcoal"
                      }`}
                    >
                      {node.node_label}
                    </td>
                    <td className="px-4 py-3 text-primary-red">
                      {node.water_level} ft
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        isDark ? "text-dark-text-secondary" : ""
                      }`}
                    >
                      {node.area}
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        isDark ? "text-dark-text-secondary" : ""
                      }`}
                    >
                      {node.state}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={node.status} />
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        isDark ? "text-dark-text-secondary" : ""
                      }`}
                    >
                      {node.last_update}
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        isDark ? "text-dark-text-secondary" : ""
                      }`}
                    >
                      {new Date(node.timestamp).toLocaleString("en-MY", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                className={`text-lg font-semibold ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Hotspot Map
              </h2>
              <p
                className={`text-xs ${
                  isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"
                }`}
              >
                Hover markers to inspect sensors
              </p>
            </div>
            <span className="text-sm font-semibold text-primary-red">
              Active Nodes: {activeNodes}
            </span>
          </div>
          <div
            className={`mt-4 rounded-2xl border ${
              isDark ? "border-dark-border" : "border-light-grey"
            }`}
          >
            <NodeMap nodes={nodes} height={280} zoom={13} />
          </div>
          <ul
            className={`mt-4 grid grid-cols-2 gap-3 text-xs font-semibold ${
              isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
            }`}
          >
            <li
              className={`rounded-2xl border px-3 py-2 ${
                isDark
                  ? "border-dark-border bg-dark-bg"
                  : "border-light-grey bg-very-light-grey"
              }`}
            >
              Critical Alerts:{" "}
              <span className="text-primary-red">{criticalAlerts}</span>
            </li>
            <li
              className={`rounded-2xl border px-3 py-2 ${
                isDark
                  ? "border-dark-border bg-dark-bg"
                  : "border-light-grey bg-very-light-grey"
              }`}
            >
              Standby Alerts:{" "}
              <span className="text-status-warning-1">{warningAlerts}</span>
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
                className={`text-lg font-semibold ${
                  isDark ? "text-dark-text" : "text-dark-charcoal"
                }`}
              >
                Time Series Analysis
              </h2>
              <p
                className={`text-xs uppercase tracking-wide ${
                  isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                }`}
              >
                Monthly average water level (ft)
              </p>
            </div>
            <span className="rounded-full bg-light-red/70 px-3 py-1 text-xs font-semibold text-primary-red">
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
                  wrapperStyle={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: chartTextColor,
                  }}
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
            className={`text-lg font-semibold ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Recent Activity
          </h2>
          <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((item) => (
              <li
                key={item.id}
                className={`rounded-2xl border px-4 py-3 ${
                  isDark ? "border-dark-border" : "border-light-grey"
                }`}
              >
                <p className="text-sm font-semibold text-primary-red">
                  {item.alert_type}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-dark-text" : "text-dark-charcoal"
                  }`}
                >
                  {item.message} ({item.area})
                </p>
                <p
                  className={`text-xs ${
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
            className={`text-lg font-semibold ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Water Level by Node ID
          </h2>
          <p
            className={`text-xs uppercase tracking-wide ${
              isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
            }`}
          >
            Current readings (ft)
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
                  wrapperStyle={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: chartTextColor,
                  }}
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
            className={`text-lg font-semibold ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            Total Flood by State
          </h2>
          <p
            className={`text-xs uppercase tracking-wide ${
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
                  wrapperStyle={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: chartTextColor,
                  }}
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
