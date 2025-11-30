"use client";

import { useMemo, useState } from "react";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import type { NodeRecord, NodeStatus } from "@/lib/data";
import { statusHexMap } from "@/lib/data";

type NodeMapProps = {
  nodes: NodeRecord[];
  height?: number;
  zoom?: number;
};

const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export default function NodeMap({
  nodes,
  height = 420,
  zoom = 14,
}: NodeMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const hasApiKey = Boolean(GOOGLE_MAPS_KEY);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  const mapCenter = useMemo(() => {
    if (!nodes.length) {
      return { lat: 1.553, lng: 110.344 };
    }
    const focusNode = nodes[0];
    return {
      lat: focusNode.coordinates.lat,
      lng: focusNode.coordinates.lng,
    };
  }, [nodes]);

  const activeNode = nodes.find((node) => node.node_id === activeNodeId);

  // ─── Fallback when no API key is configured ─────────────────────────────────
  if (!hasApiKey) {
    return (
      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-light-grey bg-very-light-grey"
        style={{ height }}
      >
        {/* Simple static map placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-status-green/10 via-status-warning-1/10 to-primary-red/10" />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-12 w-12 text-primary-red"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <p className="text-sm font-semibold text-dark-charcoal">
            Google Maps Preview
          </p>
          <p className="max-w-xs text-xs text-dark-charcoal/70">
            Set <code className="rounded bg-light-red/40 px-1">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> in{" "}
            <code className="rounded bg-light-red/40 px-1">.env.local</code> to
            enable the live map.
          </p>
        </div>
        {/* Simulated node dots */}
        <div className="absolute inset-0 z-0">
          {nodes.map((node, idx) => {
            const left = 20 + ((idx * 17) % 60);
            const top = 25 + ((idx * 23) % 50);
            return (
              <span
                key={node.node_id}
                title={node.node_label}
                className="absolute h-4 w-4 rounded-full border-2 border-white shadow"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  backgroundColor: statusHexMap[node.status],
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-2xl border border-light-grey bg-very-light-grey text-sm font-semibold text-dark-charcoal/70"
        style={{ height }}
      >
        Loading Flood Map...
      </div>
    );
  }

  // ─── Icon builder ───────────────────────────────────────────────────────────
  const getIcon = (status: NodeStatus): google.maps.Symbol | undefined => {
    if (typeof google === "undefined") {
      return undefined;
    }

    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
      fillColor: statusHexMap[status],
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.5,
      anchor: new google.maps.Point(12, 22),
    };
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height, borderRadius: "1rem" }}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        mapTypeId: "satellite",
      }}
    >
      {nodes.map((node) => (
        <Marker
          key={node.node_id}
          position={node.coordinates}
          icon={getIcon(node.status)}
          onMouseOver={() => setActiveNodeId(node.node_id)}
          onMouseOut={() => setActiveNodeId(null)}
          onClick={() => setActiveNodeId(node.node_id)}
        />
      ))}
      {activeNode && (
        <InfoWindow
          position={activeNode.coordinates}
          onCloseClick={() => setActiveNodeId(null)}
        >
          <div className="min-w-[180px] text-sm">
            <p className="font-semibold text-dark-charcoal">
              Node No. {activeNode.node_id.replace("node_", "")}
            </p>
            <p className="text-xs text-dark-charcoal/70">
              Status:{" "}
              <span
                className="font-semibold"
                style={{ color: statusHexMap[activeNode.status] }}
              >
                {activeNode.status}
              </span>
            </p>
            <p className="text-xs text-dark-charcoal/70">
              Water Level: {activeNode.water_level} ft
            </p>
            <p className="text-xs text-dark-charcoal/70">
              Longitude: {activeNode.coordinates.lng.toFixed(4)}° E
            </p>
            <p className="text-xs text-dark-charcoal/70">
              Latitude: {activeNode.coordinates.lat.toFixed(4)}° N
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

