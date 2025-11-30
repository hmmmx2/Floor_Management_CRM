"use client";

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

const maxTrendValue = Math.max(...trendSeriesMonthly.map((point) => point.value));

const trendPolyline = trendSeriesMonthly
  .map((point, index) => {
    const x = (index / (trendSeriesMonthly.length - 1)) * 100;
    const y = 100 - (point.value / maxTrendValue) * 100;
    return `${x},${y}`;
  })
  .join(" ");

export default function DashboardPage() {
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

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-dark-charcoal">Dashboard</h1>
        <p className="text-sm text-dark-charcoal/70">
          Live situational awareness for Sarawak flood defences.
        </p>
      </header>

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
          trend={{ label: `Node ${riskiestNode.node_id.split("_")[1]}`, direction: "down" }}
        />
        <OverviewCard
          title="Average Water Level"
          value={`<${(averageWaterLevel * 30).toFixed(0)}cm`}
          helper={`${averageWaterLevel.toFixed(1)} ft avg`}
          trend={{ label: "-0.2 ft today", direction: "down" }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-dark-charcoal">
                Nodes by Area
              </h2>
              <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
                Live device telemetry
              </p>
            </div>
            <span className="rounded-full bg-light-red px-4 py-1 text-xs font-semibold text-primary-red">
              Updated just now
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-light-red text-xs uppercase text-dark-charcoal">
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
                    className="border-b border-light-red/60 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold text-dark-charcoal">
                      {node.node_label}
                    </td>
                    <td className="px-4 py-3 text-primary-red">
                      {node.water_level} ft
                    </td>
                    <td className="px-4 py-3">{node.area}</td>
                    <td className="px-4 py-3">{node.state}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={node.status} />
                    </td>
                    <td className="px-4 py-3">{node.last_update}</td>
                    <td className="px-4 py-3">
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

        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-dark-charcoal">
                Hotspot Map
              </h2>
              <p className="text-xs text-dark-charcoal/70">
                Hover markers to inspect sensors
              </p>
            </div>
            <span className="text-sm font-semibold text-primary-red">
              Active Nodes: {activeNodes}
            </span>
          </div>
          <div className="mt-4 rounded-2xl border border-light-grey">
            <NodeMap nodes={nodes} height={280} zoom={13} />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-xs font-semibold text-dark-charcoal/70">
            <li className="rounded-2xl border border-light-grey bg-very-light-grey px-3 py-2">
              Critical Alerts:{" "}
              <span className="text-primary-red">{criticalAlerts}</span>
            </li>
            <li className="rounded-2xl border border-light-grey bg-very-light-grey px-3 py-2">
              Standby Alerts:{" "}
              <span className="text-status-warning-1">{warningAlerts}</span>
            </li>
          </ul>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-dark-charcoal">
                Time Series Analysis
              </h2>
              <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
                Monthly average water level (ft)
              </p>
            </div>
            <div className="flex gap-2 text-xs font-semibold text-dark-charcoal/70">
              <span className="rounded-full bg-light-red/70 px-3 py-1 text-primary-red">
                Monthly
              </span>
              <span className="rounded-full border border-light-grey px-3 py-1">
                Yearly
              </span>
            </div>
          </div>
          <div className="mt-4 h-56 rounded-2xl bg-very-light-grey p-4">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full text-primary-red"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points={trendPolyline}
              />
            </svg>
            <div className="mt-2 grid grid-cols-6 text-center text-xs font-semibold uppercase tracking-wide text-dark-charcoal/60">
              {trendSeriesMonthly.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Recent Activity
          </h2>
          <ul className="mt-4 space-y-3">
            {recentActivity.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-light-grey px-4 py-3"
              >
                <p className="text-sm font-semibold text-primary-red">
                  {item.alert_type}
                </p>
                <p className="text-sm text-dark-charcoal">
                  {item.message} ({item.area})
                </p>
                <p className="text-xs text-dark-charcoal/60">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Water Level by Node ID
          </h2>
          <div className="mt-4 space-y-4">
            {waterLevelByNode.map((entry) => (
              <div key={entry.label}>
                <div className="flex items-center justify-between text-sm font-semibold text-dark-charcoal">
                  <span>{entry.label}</span>
                  <span>{entry.value} ft</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-very-light-grey">
                  <div
                    className="h-full rounded-full bg-primary-red"
                    style={{ width: `${(entry.value / 3) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Total Flood by State
          </h2>
          <div className="mt-4 space-y-4">
            {floodTotalsByState.map((stateStat) => (
              <div key={stateStat.state}>
                <div className="flex items-center justify-between text-sm font-semibold text-dark-charcoal">
                  <span>{stateStat.state}</span>
                  <span>{stateStat.total}</span>
                </div>
                <div className="mt-2 h-4 rounded-full bg-very-light-grey">
                  <div
                    className="h-full rounded-full bg-light-red"
                    style={{
                      width: `${(stateStat.total / 900) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

