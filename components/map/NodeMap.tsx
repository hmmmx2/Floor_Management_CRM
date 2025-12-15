"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import { NodeData, statusHexMap, offlineColor, getStatusLabel, getMarkerColor } from "@/lib/types";

type NodeMapProps = {
  nodes: NodeData[];
  height?: number;
  zoom?: number;
  focusOnLatest?: boolean; // Auto-focus on most recently updated node
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
  zoom = 12,
  focusOnLatest = true,
}: NodeMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);
  const [lastFocusedNodeId, setLastFocusedNodeId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

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

  // Find the most recently updated node
  const latestUpdatedNode = useMemo(() => {
    if (!nodes.length) return null;
    return nodes.reduce((latest, node) => {
      const latestTime = new Date(latest.last_updated).getTime();
      const nodeTime = new Date(node.last_updated).getTime();
      return nodeTime > latestTime ? node : latest;
    });
  }, [nodes]);

  // Pan to the most recently updated node when it changes
  useEffect(() => {
    if (
      focusOnLatest &&
      latestUpdatedNode &&
      mapRef.current &&
      latestUpdatedNode._id !== lastFocusedNodeId
    ) {
      const newPosition = {
        lat: latestUpdatedNode.latitude,
        lng: latestUpdatedNode.longitude,
      };
      
      // Smoothly pan to the new position
      mapRef.current.panTo(newPosition);
      
      // Optionally highlight the node
      setActiveNodeId(latestUpdatedNode._id);
      setLastFocusedNodeId(latestUpdatedNode._id);
      
      // Auto-close the info window after 5 seconds
      setTimeout(() => {
        setActiveNodeId(null);
      }, 5000);
    }
  }, [latestUpdatedNode, focusOnLatest, lastFocusedNodeId]);

  // Calculate initial map center
  const mapCenter = useMemo(() => {
    // If we have a latest node and focus is enabled, center on it
    if (focusOnLatest && latestUpdatedNode) {
      return { lat: latestUpdatedNode.latitude, lng: latestUpdatedNode.longitude };
    }
    
    if (!nodes.length) {
      return { lat: 1.553, lng: 110.344 }; // Default Sarawak location
    }
    // Calculate center from all nodes
    const avgLat = nodes.reduce((sum, n) => sum + n.latitude, 0) / nodes.length;
    const avgLng = nodes.reduce((sum, n) => sum + n.longitude, 0) / nodes.length;
    return { lat: avgLat, lng: avgLng };
  }, [nodes, focusOnLatest, latestUpdatedNode]);

  const activeNode = nodes.find((node) => node._id === activeNodeId);

  // Callback to store map reference
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapError(false);
  }, []);

  // Show placeholder if no valid API key or if there's an error
  if (!hasValidApiKey || mapError || loadError) {
    return (
      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-light-grey bg-gradient-to-br from-very-light-grey to-light-grey/30 dark:border-dark-border dark:from-dark-bg dark:to-dark-card"
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
          {nodes.slice(0, 6).map((node, index) => (
            <div
              key={node._id}
              className="flex h-8 w-8 items-center justify-center rounded-full shadow-md"
              style={{
                backgroundColor: getMarkerColor(node),
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
          <p className="text-sm font-semibold text-dark-charcoal dark:text-dark-text">
            Interactive Map Preview
          </p>
          <p className="mt-1 text-xs text-dark-charcoal/60 dark:text-dark-text-muted">
            {nodes.length} sensor{nodes.length !== 1 ? "s" : ""} from MongoDB
          </p>
        </div>

        {/* Node summary cards */}
        <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-2 px-4">
          {nodes.slice(0, 4).map((node) => (
            <div
              key={node._id}
              className="flex items-center gap-2 rounded-lg bg-pure-white/80 dark:bg-dark-card/80 px-2 py-1 text-xs shadow-sm backdrop-blur"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getMarkerColor(node) }}
              />
              <span className="font-medium text-dark-charcoal dark:text-dark-text">
                {node.node_id}
              </span>
              <span className="text-dark-charcoal/60 dark:text-dark-text-muted">{node.current_level}ft</span>
            </div>
          ))}
          {nodes.length > 4 && (
            <div className="flex items-center rounded-lg bg-light-red/50 dark:bg-primary-red/20 px-2 py-1 text-xs font-medium text-primary-red">
              +{nodes.length - 4} more
            </div>
          )}
        </div>

        {/* Configuration hint */}
        <p className="absolute bottom-3 text-[10px] text-dark-charcoal/40 dark:text-dark-text-muted">
          Configure NEXT_PUBLIC_GOOGLE_MAPS_KEY for live map
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-2xl border border-light-grey dark:border-dark-border bg-very-light-grey dark:bg-dark-bg"
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-light-grey dark:border-dark-border border-t-primary-red" />
          <p className="text-sm font-semibold text-dark-charcoal/70 dark:text-dark-text-secondary">
            Loading Flood Map...
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (node: NodeData): google.maps.Symbol | undefined => {
    if (typeof google === "undefined") {
      return undefined;
    }

    const color = getMarkerColor(node);
    const isLatest = latestUpdatedNode?._id === node._id;

    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
      fillColor: color,
      fillOpacity: 1,
      strokeColor: isLatest ? "#FFD700" : "#ffffff", // Gold border for latest updated
      strokeWeight: isLatest ? 3 : 2,
      scale: isLatest ? 1.8 : 1.5, // Slightly larger for latest
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
      onLoad={onMapLoad}
    >
      {nodes.map((node) => (
        <Marker
          key={node._id}
          position={{ lat: node.latitude, lng: node.longitude }}
          icon={getIcon(node)}
          onMouseOver={() => setActiveNodeId(node._id)}
          onMouseOut={() => setActiveNodeId(null)}
          onClick={() => setActiveNodeId(node._id)}
          animation={
            latestUpdatedNode?._id === node._id
              ? google.maps.Animation.BOUNCE
              : undefined
          }
        />
      ))}
      {activeNode && (
        <InfoWindow
          position={{ lat: activeNode.latitude, lng: activeNode.longitude }}
          onCloseClick={() => setActiveNodeId(null)}
          options={{ 
            pixelOffset: new google.maps.Size(0, -30),
            disableAutoPan: true 
          }}
        >
          <div className="min-w-[200px] p-1 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-dark-charcoal">
                Node ID: {activeNode.node_id}
              </p>
              {latestUpdatedNode?._id === activeNode._id && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  LATEST
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-2 text-xs text-dark-charcoal/70">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: getMarkerColor(activeNode) }}
                />
                Water Status: <span className="font-semibold">{getStatusLabel(activeNode.current_level)}</span>
              </p>
              <p className="text-xs text-dark-charcoal/70">
                Water Level:{" "}
                <span className="font-semibold text-primary-red">
                  {activeNode.current_level} ft
                </span>
              </p>
              <p className="text-xs text-dark-charcoal/70">
                Node Status:{" "}
                <span className={`font-semibold ${activeNode.is_dead ? "text-status-danger" : "text-status-green"}`}>
                  {activeNode.is_dead ? "Offline" : "Online"}
                </span>
              </p>
              <p className="text-xs text-dark-charcoal/70">
                Last Updated:{" "}
                <span className="font-medium">
                  {new Date(activeNode.last_updated).toLocaleString("en-MY", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </p>
              <p className="text-xs text-dark-charcoal/50 pt-1 border-t border-light-grey">
                {activeNode.latitude.toFixed(6)}°N, {activeNode.longitude.toFixed(6)}°E
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
