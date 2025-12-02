// Shared types for client and server components

// Node type definition based on MongoDB schema
export interface NodeData {
  _id: string;
  node_id: string;
  latitude: number;
  longitude: number;
  current_level: number; // 0 = 0ft, 1 = 1ft, 2 = 2ft, 3 = 3ft
  is_dead: boolean; // false = alive, true = dead
  last_updated: Date | string;
  created_at: Date | string;
}

// Helper function to determine water level status
export function getWaterLevelStatus(level: number): {
  label: string;
  color: string;
  severity: "normal" | "warning" | "danger" | "critical";
} {
  switch (level) {
    case 0:
      return { label: "Normal (0ft)", color: "status-green", severity: "normal" };
    case 1:
      return { label: "Alert (1ft)", color: "status-warning-1", severity: "warning" };
    case 2:
      return { label: "Warning (2ft)", color: "status-warning-2", severity: "danger" };
    case 3:
      return { label: "Critical (3ft)", color: "status-danger", severity: "critical" };
    default:
      return { label: `Unknown (${level}ft)`, color: "light-grey", severity: "normal" };
  }
}

// Helper function to get node status
export function getNodeStatus(isDead: boolean): {
  label: string;
  color: string;
} {
  return isDead
    ? { label: "Offline", color: "status-danger" }
    : { label: "Online", color: "status-green" };
}

// Status hex colors for map markers
export const statusHexMap: Record<number, string> = {
  0: "#56e40a", // status-green - Normal
  1: "#ffd54f", // status-warning-1 - Alert
  2: "#ff9f1c", // status-warning-2 - Warning
  3: "#d7263d", // status-danger - Critical
};

// Offline node color
export const offlineColor = "#6b7280";

// Get status label from level
export function getStatusLabel(level: number): string {
  switch (level) {
    case 0:
      return "Normal";
    case 1:
      return "Alert";
    case 2:
      return "Warning";
    case 3:
      return "Critical";
    default:
      return "Unknown";
  }
}

// Get marker color for a node
export function getMarkerColor(node: NodeData): string {
  if (node.is_dead) return offlineColor;
  return statusHexMap[node.current_level] || statusHexMap[0];
}

