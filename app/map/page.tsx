"use client";

import NodeMap from "@/components/map/NodeMap";
import { nodes, statusLegend } from "@/lib/data";

export default function FloodMapPage() {
  const activeNodes = nodes.filter((node) => node.is_active).length;
  const inactiveNodes = nodes.length - activeNodes;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-dark-charcoal">Flood Map</h1>
        <p className="text-sm text-dark-charcoal/70">
          Google Maps overlays show every live sensor. Hover markers to inspect
          a node&apos;s health, water level, and coordinates.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]">
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
                Live View
              </p>
              <h2 className="text-lg font-semibold text-dark-charcoal">
                IoT Nodes on Google Maps
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-dark-charcoal">
              <span>
                Active Nodes:{" "}
                <span className="text-status-green">{activeNodes}</span>
              </span>
              <span>
                Inactive Nodes:{" "}
                <span className="text-primary-red">{inactiveNodes}</span>
              </span>
            </div>
          </div>
          <div className="mt-4 rounded-3xl border border-light-grey">
            <NodeMap nodes={nodes} height={460} zoom={14} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-dark-charcoal/70">
            <span className="font-semibold text-dark-charcoal">
              Status Legend Logic:
            </span>
            <span>Safe = 0 ft</span>
            <span>Warning Level 1 = 1 ft</span>
            <span>Warning Level 2 = 2 ft</span>
            <span>Danger = 3 ft</span>
          </div>
        </article>

        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-dark-charcoal">
            Status Legend
          </h2>
          <p className="text-xs text-dark-charcoal/70">
            Every pin follows the Sarawak flood SOP levels.
          </p>
          <ul className="mt-4 space-y-3">
            {statusLegend.map((legend) => (
              <li
                key={legend.label}
                className="flex items-center justify-between rounded-2xl border border-light-grey px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${legend.color}`}
                  >
                    {legend.water_level}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-dark-charcoal">
                      {legend.label}
                    </p>
                    <p className="text-xs text-dark-charcoal/70">
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
          <div className="mt-6 rounded-2xl bg-very-light-grey px-4 py-3 text-xs text-dark-charcoal/70">
            <p className="font-semibold uppercase tracking-wide text-dark-charcoal">
              Map Footer
            </p>
            <p>
              Total Active Nodes: {activeNodes} | Total Inactive Nodes:{" "}
              {inactiveNodes}
            </p>
            <p>
              Hover any green marker to open its InfoWindow and review water
              level, status, and precise coordinates.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

