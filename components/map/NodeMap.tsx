"use client";

import { useEffect, useMemo, useState } from "react";

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

const mapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "simplified" }],
  },
];

// Check if we have a valid API key
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
const hasValidApiKey = apiKey.length > 10 && !apiKey.includes("Example");

export default function NodeMap({
  nodes,
  height = 420,
  zoom = 14,
}: NodeMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  // Track if map fails to load properly
  useEffect(() => {
    if (loadError) {
      setMapError(true);
    }
  }, [loadError]);

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

  // Show placeholder if no valid API key or if there's an error
  if (!hasValidApiKey || mapError || loadError) {
    return (
      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-light-grey bg-gradient-to-br from-very-light-grey to-light-grey/30"
        style={{ height }}
      >
        {/* Decorative map pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#4E4B4B" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map pin icons representing nodes */}
        <div className="relative mb-4 flex items-center justify-center gap-2">
          {nodes.slice(0, 4).map((node, index) => (
            <div
              key={node.node_id}
              className="flex h-8 w-8 items-center justify-center rounded-full shadow-md"
              style={{
                backgroundColor: statusHexMap[node.status],
                transform: `translateY(${index % 2 === 0 ? -4 : 4}px)`,
              }}
            >
              <svg
                className="h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center">
          <p className="text-sm font-semibold text-dark-charcoal">
            Interactive Map Preview
          </p>
          <p className="mt-1 text-xs text-dark-charcoal/60">
            {nodes.length} sensor{nodes.length !== 1 ? "s" : ""} in Sarawak region
          </p>
        </div>

        {/* Node summary cards */}
        <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-2 px-4">
          {nodes.slice(0, 3).map((node) => (
            <div
              key={node.node_id}
              className="flex items-center gap-2 rounded-lg bg-pure-white/80 px-2 py-1 text-xs shadow-sm backdrop-blur"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: statusHexMap[node.status] }}
              />
              <span className="font-medium text-dark-charcoal">
                {node.node_label}
              </span>
              <span className="text-dark-charcoal/60">{node.water_level}ft</span>
            </div>
          ))}
          {nodes.length > 3 && (
            <div className="flex items-center rounded-lg bg-light-red/50 px-2 py-1 text-xs font-medium text-primary-red">
              +{nodes.length - 3} more
            </div>
          )}
        </div>

        {/* Configuration hint */}
        <p className="absolute bottom-3 text-[10px] text-dark-charcoal/40">
          Configure NEXT_PUBLIC_GOOGLE_MAPS_KEY for live map
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-2xl border border-light-grey bg-very-light-grey"
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-light-grey border-t-primary-red" />
          <p className="text-sm font-semibold text-dark-charcoal/70">
            Loading Flood Map...
          </p>
        </div>
      </div>
    );
  }

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
      anchor: new google.maps.Point(12, 24),
    };
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height, borderRadius: "16px" }}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: mapStyles,
        gestureHandling: "greedy",
      }}
      onLoad={() => setMapError(false)}
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
          options={{ pixelOffset: new google.maps.Size(0, -30) }}
        >
          <div className="min-w-[180px] p-1 text-sm">
            <p className="font-semibold text-dark-charcoal">
              {activeNode.node_label}
            </p>
            <div className="mt-1 space-y-0.5">
              <p className="flex items-center gap-2 text-xs text-dark-charcoal/70">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: statusHexMap[activeNode.status] }}
                />
                Status: <span className="font-semibold">{activeNode.status}</span>
              </p>
              <p className="text-xs text-dark-charcoal/70">
                Water Level:{" "}
                <span className="font-semibold text-primary-red">
                  {activeNode.water_level} ft
                </span>
              </p>
              <p className="text-xs text-dark-charcoal/70">
                Area: {activeNode.area}
              </p>
              <p className="text-xs text-dark-charcoal/50">
                {activeNode.coordinates.lat.toFixed(4)}°N,{" "}
                {activeNode.coordinates.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
