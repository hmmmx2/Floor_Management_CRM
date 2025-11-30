"use client";

import OverviewCard from "@/components/cards/OverviewCard";
import { floodTotalsByState, nodes } from "@/lib/data";

const nodesSchema = `{
  "_id": ObjectId("..."),
  "node_id": "node_1",
  "coordinates": { "lat": 1.5574, "lng": 110.344 },
  "current_data": {
    "water_level": 0,
    "battery": 85,
    "status": "Safe"
  },
  "is_active": true,
  "last_communication": "2023-10-27T09:30:00Z"
}`;

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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            High-Risk States
          </h2>
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Aggregated flood counts
          </p>
          <div className="mt-4 space-y-3">
            {floodTotalsByState.map((state) => (
              <div
                key={state.state}
                className="flex items-center justify-between rounded-2xl border border-light-grey px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-dark-charcoal">
                    {state.state}
                  </p>
                  <p className="text-xs text-dark-charcoal/70">
                    Critical: {state.critical}
                  </p>
                </div>
                <span className="text-lg font-bold text-primary-red">
                  {state.total}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Nodes Collection Schema
          </h2>
          <p className="text-xs text-dark-charcoal/70">
            MongoDB document that powers this dashboard.
          </p>
          <pre className="mt-4 h-full rounded-2xl bg-very-light-grey p-4 text-xs text-dark-charcoal overflow-auto">
{nodesSchema}
          </pre>
        </article>
      </div>

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

