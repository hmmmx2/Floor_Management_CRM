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

export default function NodeMap({
  nodes,
  height = 420,
  zoom = 14,
}: NodeMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ??
      "AIzaSyA-ExampleFloodKey123456789", // fallback provided in spec
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
      scale: 1,
      anchor: new google.maps.Point(12, 24),
    };
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height }}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        styles: mapStyles,
        gestureHandling: "greedy",
      }}
    >
      {nodes.map((node) => (
        <Marker
          key={node.node_id}
          position={node.coordinates}
          icon={getIcon(node.status)}
          onMouseOver={() => setActiveNodeId(node.node_id)}
          onMouseOut={() => setActiveNodeId(null)}
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
              Status: <span className="font-semibold">{activeNode.status}</span>
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

