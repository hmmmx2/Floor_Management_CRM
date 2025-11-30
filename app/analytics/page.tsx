"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import OverviewCard from "@/components/cards/OverviewCard";
import {
  alertRecords,
  floodTotalsByState,
  nodes,
  trendSeriesMonthly,
  waterLevelByNode,
} from "@/lib/data";

// ─── Derived data for charts ─────────────────────────────────────────────────
const lineChartData = trendSeriesMonthly.map((pt) => ({
  name: pt.label,
  waterLevel: pt.value,
}));

const barChartData = waterLevelByNode.map((n) => ({
  name: n.label.replace("Node No. ", "N"),
  level: n.value,
}));

const alertTypeCounts = alertRecords.reduce(
  (acc, alert) => {
    acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);
const pieChartData = Object.entries(alertTypeCounts).map(([name, value]) => ({
  name,
  value,
}));

const PIE_COLORS = ["#ED1C24", "#FF9F1C", "#56E40A", "#BFBFBF"];

const bubbleData = nodes.map((node) => ({
  x: node.coordinates.lng,
  y: node.coordinates.lat,
  z: (node.water_level + 1) * 120,
  name: node.node_label,
  level: node.water_level,
  status: node.status,
}));

const stateBarData = floodTotalsByState.map((s) => ({
  name: s.state,
  total: s.total,
  critical: s.critical,
}));

// Bubble chart legend data
const bubbleLegendData = [
  { value: "Safe (0 ft)", color: "#56E40A" },
  { value: "Warning L1 (1 ft)", color: "#FFD54F" },
  { value: "Warning L2 (2 ft)", color: "#FF9F1C" },
  { value: "Danger (3+ ft)", color: "#ED1C24" },
];

export default function AnalyticsPage() {
  const averageBattery = 87;
  const uptime = 99.2;
  const probabilityOfFlood = 12;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-dark-charcoal">Analytics</h1>
        <p className="text-sm text-dark-charcoal/70">
          Insights derived from MongoDB + Google Maps telemetry to aid planning
          and mitigation.
        </p>
      </header>

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <OverviewCard
          title="Flood Probability"
          value={`${probabilityOfFlood}%`}
          helper="7-day prediction window"
          trend={{ label: "-2 pts vs yesterday", direction: "down" }}
        />
        <OverviewCard
          title="Average Battery"
          value={`${averageBattery}%`}
          helper="Across all IoT nodes"
          trend={{ label: "+1.4% today", direction: "up" }}
        />
        <OverviewCard
          title="Signal Uptime"
          value={`${uptime}%`}
          helper="LoRaWAN heartbeat"
          trend={{ label: "Target 99%", direction: "flat" }}
        />
      </div>

      {/* ─── Row 1: Line Chart + Bar Chart ──────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Area/Line Chart – Time Series */}
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-dark-charcoal">
                Time Series Analysis
              </h2>
              <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
                Monthly average water level (ft)
              </p>
            </div>
            <span className="rounded-full bg-light-red/70 px-3 py-1 text-xs font-semibold text-primary-red">
              Monthly
            </span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ED1C24" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ED1C24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#4E4B4B" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Month",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: "#4E4B4B",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#4E4B4B" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "dataMax + 0.5"]}
                  label={{
                    value: "Water Level (ft)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: "#4E4B4B",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #BFBFBF",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value} ft`, "Water Level"]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
                />
                <Area
                  type="monotone"
                  dataKey="waterLevel"
                  name="Avg Water Level"
                  stroke="#ED1C24"
                  strokeWidth={2}
                  fill="url(#colorWater)"
                  dot={{ r: 4, fill: "#ED1C24" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Bar Chart – Water Level by Node */}
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Water Level by Node
          </h2>
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Current readings (ft)
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#4E4B4B" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Node ID",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: "#4E4B4B",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#4E4B4B" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 4]}
                  label={{
                    value: "Water Level (ft)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: "#4E4B4B",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #BFBFBF",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value} ft`, "Water Level"]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="square"
                  wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
                />
                <Bar
                  dataKey="level"
                  name="Current Water Level"
                  fill="#ED1C24"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      {/* ─── Row 2: Pie Chart + Bubble/Scatter Map ──────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart – Alert Distribution */}
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Alert Distribution
          </h2>
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            By alert type
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={{ stroke: "#BFBFBF", strokeWidth: 1 }}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #BFBFBF",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [value, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Bubble Chart – Node Severity Map */}
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Node Severity Bubble Map
          </h2>
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Bubble size = water level severity
          </p>
          {/* Custom Legend for Bubble Chart */}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {bubbleLegendData.map((item) => (
              <div key={item.value} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] font-medium text-dark-charcoal">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Longitude"
                  tick={{ fontSize: 10, fill: "#4E4B4B" }}
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tickFormatter={(v) => v.toFixed(1)}
                  label={{
                    value: "Longitude (°E)",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: "#4E4B4B",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Latitude"
                  tick={{ fontSize: 10, fill: "#4E4B4B" }}
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  tickFormatter={(v) => v.toFixed(1)}
                  label={{
                    value: "Latitude (°N)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: "#4E4B4B",
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #BFBFBF",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "z") return null;
                    return [value.toFixed(4), name];
                  }}
                />
                <Scatter name="Nodes" data={bubbleData} fill="#ED1C24">
                  {bubbleData.map((entry) => {
                    let color = "#56E40A";
                    if (entry.level === 1) color = "#FFD54F";
                    if (entry.level === 2) color = "#FF9F1C";
                    if (entry.level >= 3) color = "#ED1C24";
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      {/* ─── Row 3: Stacked Bar – Flood by State ────────────────────────────── */}
      <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-charcoal">
          Total Flood by State
        </h2>
        <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
          Total vs Critical incidents comparison
        </p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateBarData} layout="vertical" barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#4E4B4B" }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Number of Incidents",
                  position: "insideBottom",
                  offset: -5,
                  fontSize: 11,
                  fill: "#4E4B4B",
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#4E4B4B" }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #BFBFBF",
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="square"
                wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
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

      {/* ─── Recommendation Engine ──────────────────────────────────────────── */}
      <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-charcoal">
          Recommendation Engine
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-light-grey p-4">
            <p className="text-sm font-semibold text-primary-red">Escalate</p>
            <p className="mt-2 text-sm text-dark-charcoal/80">
              Node {nodes[1].node_id.toUpperCase()} is trending at water level{" "}
              {nodes[1].water_level} ft. Auto-create a Danger alert if it stays
              above threshold for 10 minutes.
            </p>
          </div>
          <div className="rounded-2xl border border-light-grey p-4">
            <p className="text-sm font-semibold text-status-warning-2">
              Preventive
            </p>
            <p className="mt-2 text-sm text-dark-charcoal/80">
              Schedule maintenance for nodes with battery &lt; 80%. Current
              backlog: 3 nodes.
            </p>
          </div>
          <div className="rounded-2xl border border-light-grey p-4">
            <p className="text-sm font-semibold text-status-green">Operational</p>
            <p className="mt-2 text-sm text-dark-charcoal/80">
              Auto-share a CSV snapshot with the command center every 6 hours.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
