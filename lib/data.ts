export type WaterLevel = 0 | 1 | 2 | 3;
export type NodeStatus =
  | "Safe"
  | "Warning Level 1"
  | "Warning Level 2"
  | "Danger";
export type AlertType = "DANGER" | "WARNING" | "NEW NODE" | "INACTIVE";

export interface NodeRecord {
  node_id: string;
  node_label: string;
  area: string;
  location: string;
  state: string;
  water_level: WaterLevel;
  status: NodeStatus;
  last_update: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  is_active: boolean;
}

export interface SensorTableRow {
  id: string;
  node_id: string;
  node_label: string;
  water_level: WaterLevel;
  area: string;
  location: string;
  state: string;
  status: NodeStatus;
  last_update: string;
  timestamp: string;
}

export interface AlertRecord {
  id: string;
  alert_type: AlertType;
  node_reference: string;
  water_level: WaterLevel;
  area: string;
  message: string;
  timestamp: string;
  category: "recent" | "lastWeek";
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface StateFloodStat {
  state: string;
  total: number;
  critical: number;
}

export const deriveStatusFromLevel = (level: WaterLevel): NodeStatus => {
  switch (level) {
    case 0:
      return "Safe";
    case 1:
      return "Warning Level 1";
    case 2:
      return "Warning Level 2";
    default:
      return "Danger";
  }
};

export const statusToneMap: Record<
  NodeStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  Safe: {
    bg: "bg-status-green/15",
    text: "text-status-green",
    border: "border-status-green/30",
    dot: "bg-status-green",
  },
  "Warning Level 1": {
    bg: "bg-status-warning-1/20",
    text: "text-status-warning-1",
    border: "border-status-warning-1/30",
    dot: "bg-status-warning-1",
  },
  "Warning Level 2": {
    bg: "bg-status-warning-2/20",
    text: "text-status-warning-2",
    border: "border-status-warning-2/40",
    dot: "bg-status-warning-2",
  },
  Danger: {
    bg: "bg-light-red",
    text: "text-primary-red",
    border: "border-primary-red/50",
    dot: "bg-primary-red",
  },
};

export const statusHexMap: Record<NodeStatus, string> = {
  Safe: "#56E40A",
  "Warning Level 1": "#FFD54F",
  "Warning Level 2": "#FF9F1C",
  Danger: "#ED1C24",
};

export const statusLegend = [
  {
    label: "Safe" as NodeStatus,
    description: "Water Level 0 (Normal)",
    color: "bg-status-green/15 text-status-green",
    water_level: 0,
  },
  {
    label: "Warning Level 1" as NodeStatus,
    description: "Water Level 1",
    color: "bg-status-warning-1/20 text-status-warning-1",
    water_level: 1,
  },
  {
    label: "Warning Level 2" as NodeStatus,
    description: "Water Level 2",
    color: "bg-status-warning-2/20 text-status-warning-2",
    water_level: 2,
  },
  {
    label: "Danger" as NodeStatus,
    description: "Water Level 3",
    color: "bg-light-red text-primary-red",
    water_level: 3,
  },
];

const rawNodes: Omit<NodeRecord, "status">[] = [
  {
    node_id: "node_1",
    node_label: "Node No. 1",
    area: "Waterfront, Kuching",
    location: "Latitude: 1.5559° N, Longitude: 110.3463° E",
    state: "Sarawak",
    water_level: 0,
    last_update: "12 mins ago",
    timestamp: "2025-11-19T14:22:05Z",
    coordinates: { lat: 1.5559, lng: 110.3463 },
    is_active: true,
  },
  {
    node_id: "node_2",
    node_label: "Node No. 2",
    area: "Padungan, Kuching",
    location: "Latitude: 1.5638° N, Longitude: 110.3456° E",
    state: "Sarawak",
    water_level: 3,
    last_update: "47 mins ago",
    timestamp: "2025-11-19T13:47:58Z",
    coordinates: { lat: 1.5638, lng: 110.3456 },
    is_active: true,
  },
  {
    node_id: "node_3",
    node_label: "Node No. 3",
    area: "Satok, Kuching",
    location: "Latitude: 1.5605° N, Longitude: 110.3493° E",
    state: "Sarawak",
    water_level: 2,
    last_update: "3 hours 10 mins ago",
    timestamp: "2025-11-19T11:04:30Z",
    coordinates: { lat: 1.5605, lng: 110.3493 },
    is_active: true,
  },
  {
    node_id: "node_4",
    node_label: "Node No. 4",
    area: "Stulang, Johor Bahru",
    location: "Latitude: 1.4927° N, Longitude: 103.7753° E",
    state: "Johor",
    water_level: 1,
    last_update: "1 hour 10 mins ago",
    timestamp: "2025-11-19T12:49:13Z",
    coordinates: { lat: 1.4927, lng: 103.7753 },
    is_active: true,
  },
  {
    node_id: "node_5",
    node_label: "Node No. 5",
    area: "Ampang, Kuala Lumpur",
    location: "Latitude: 3.1461° N, Longitude: 101.7070° E",
    state: "Kuala Lumpur",
    water_level: 0,
    last_update: "2 days ago",
    timestamp: "2025-11-17T08:15:00Z",
    coordinates: { lat: 3.1461, lng: 101.707 },
    is_active: false,
  },
];

export const nodes: NodeRecord[] = rawNodes.map((node) => ({
  ...node,
  status: deriveStatusFromLevel(node.water_level),
}));

export const sensorsTableData: SensorTableRow[] = [
  {
    id: "reading-1",
    node_id: "node_1",
    node_label: "Node No. 1",
    water_level: 0,
    area: "Kuching",
    location: "Latitude: 1.5559° N, Longitude: 110.3463° E",
    state: "Sarawak",
    status: deriveStatusFromLevel(0),
    last_update: "12 mins ago",
    timestamp: "2025-11-19T14:22:05Z",
  },
  {
    id: "reading-2",
    node_id: "node_1",
    node_label: "Node No. 1",
    water_level: 1,
    area: "Kuching",
    location: "Latitude: 1.5562° N, Longitude: 110.3478° E",
    state: "Sarawak",
    status: deriveStatusFromLevel(1),
    last_update: "1 hour 25 mins ago",
    timestamp: "2025-11-19T12:49:13Z",
  },
  {
    id: "reading-3",
    node_id: "node_2",
    node_label: "Node No. 2",
    water_level: 3,
    area: "Kuching",
    location: "Latitude: 1.5638° N, Longitude: 110.3456° E",
    state: "Sarawak",
    status: deriveStatusFromLevel(3),
    last_update: "47 mins ago",
    timestamp: "2025-11-19T13:47:58Z",
  },
  {
    id: "reading-4",
    node_id: "node_2",
    node_label: "Node No. 2",
    water_level: 2,
    area: "Kuching",
    location: "Latitude: 1.5636° N, Longitude: 110.3453° E",
    state: "Sarawak",
    status: deriveStatusFromLevel(2),
    last_update: "2 hours 10 mins ago",
    timestamp: "2025-11-19T11:04:30Z",
  },
  {
    id: "reading-5",
    node_id: "node_3",
    node_label: "Node No. 3",
    water_level: 1,
    area: "Jalan Satok",
    location: "Latitude: 1.5603° N, Longitude: 110.3490° E",
    state: "Sarawak",
    status: deriveStatusFromLevel(1),
    last_update: "1 hour 25 mins ago",
    timestamp: "2025-11-19T12:49:13Z",
  },
  {
    id: "reading-6",
    node_id: "node_3",
    node_label: "Node No. 3",
    water_level: 2,
    area: "Jalan Satok",
    location: "Latitude: 1.5605° N, Longitude: 110.3493° E",
    state: "Sarawak",
    status: deriveStatusFromLevel(2),
    last_update: "3 hours 10 mins ago",
    timestamp: "2025-11-19T11:04:30Z",
  },
];

export const alertRecords: AlertRecord[] = [
  // ─── Recent ────────────────────────────────────────────────────────────────
  {
    id: "alert-1",
    alert_type: "DANGER",
    node_reference: "node_2",
    water_level: 3,
    area: "Waterfront, Kuching",
    message: "Water reached level 3 at Kuching Waterfront",
    timestamp: "2025-11-19T13:47:58Z",
    category: "recent",
  },
  {
    id: "alert-2",
    alert_type: "WARNING",
    node_reference: "node_3",
    water_level: 2,
    area: "Satok, Kuching",
    message: "Warning triggered for Node No. 3",
    timestamp: "2025-11-19T12:30:00Z",
    category: "recent",
  },
  {
    id: "alert-3",
    alert_type: "WARNING",
    node_reference: "node_1",
    water_level: 1,
    area: "Waterfront, Kuching",
    message: "Warning triggered for Node No. 1",
    timestamp: "2025-11-19T11:45:00Z",
    category: "recent",
  },
  {
    id: "alert-7",
    alert_type: "INACTIVE",
    node_reference: "node_5",
    water_level: 0,
    area: "Ampang, Kuala Lumpur",
    message: "Node No. 5 stopped sending heartbeat signals",
    timestamp: "2025-11-19T10:20:00Z",
    category: "recent",
  },
  {
    id: "alert-8",
    alert_type: "NEW NODE",
    node_reference: "node_6",
    water_level: 0,
    area: "Petaling Jaya, Selangor",
    message: "Node No. 6 commissioned at PJ Section 17",
    timestamp: "2025-11-19T08:00:00Z",
    category: "recent",
  },
  // ─── Last Week ─────────────────────────────────────────────────────────────
  {
    id: "alert-4",
    alert_type: "NEW NODE",
    node_reference: "node_5",
    water_level: 0,
    area: "Ampang, Kuala Lumpur",
    message: "Node No. 5 commissioned at Ampang intake",
    timestamp: "2025-11-12T09:15:00Z",
    category: "lastWeek",
  },
  {
    id: "alert-5",
    alert_type: "INACTIVE",
    node_reference: "node_1",
    water_level: 0,
    area: "Waterfront, Kuching",
    message: "Node No. 1 inactive for 12 hours",
    timestamp: "2025-11-11T21:30:00Z",
    category: "lastWeek",
  },
  {
    id: "alert-9",
    alert_type: "INACTIVE",
    node_reference: "node_3",
    water_level: 0,
    area: "Satok, Kuching",
    message: "Node No. 3 inactive for 6 hours",
    timestamp: "2025-11-11T15:00:00Z",
    category: "lastWeek",
  },
  {
    id: "alert-6",
    alert_type: "WARNING",
    node_reference: "node_2",
    water_level: 2,
    area: "Padungan, Kuching",
    message: "Water level rising at Node No. 2",
    timestamp: "2025-11-10T16:45:00Z",
    category: "lastWeek",
  },
  {
    id: "alert-10",
    alert_type: "NEW NODE",
    node_reference: "node_4",
    water_level: 0,
    area: "Stulang, Johor Bahru",
    message: "Node No. 4 installed at Johor Bahru riverbank",
    timestamp: "2025-11-09T14:30:00Z",
    category: "lastWeek",
  },
  {
    id: "alert-11",
    alert_type: "DANGER",
    node_reference: "node_3",
    water_level: 3,
    area: "Satok, Kuching",
    message: "Flash flood warning – Node No. 3 critical",
    timestamp: "2025-11-08T22:10:00Z",
    category: "lastWeek",
  },
  {
    id: "alert-12",
    alert_type: "WARNING",
    node_reference: "node_1",
    water_level: 1,
    area: "Waterfront, Kuching",
    message: "Minor water level increase detected at Node No. 1",
    timestamp: "2025-11-08T14:20:00Z",
    category: "lastWeek",
  },
];

export const trendSeriesMonthly: TrendPoint[] = [
  { label: "Jan", value: 0.5 },
  { label: "Feb", value: 0.6 },
  { label: "Mar", value: 0.4 },
  { label: "Apr", value: 0.5 },
  { label: "May", value: 0.7 },
  { label: "Jun", value: 0.8 },
  { label: "Jul", value: 1.9 },
  { label: "Aug", value: 0.6 },
  { label: "Sep", value: 0.5 },
  { label: "Oct", value: 0.4 },
  { label: "Nov", value: 0.6 },
  { label: "Dec", value: 0.5 },
];

export const waterLevelByNode = nodes.map((node) => ({
  label: node.node_label,
  value: node.water_level,
}));

export const floodTotalsByState: StateFloodStat[] = [
  { state: "Sabah", total: 345, critical: 120 },
  { state: "Sarawak", total: 485, critical: 218 },
  { state: "Johor Bahru", total: 539, critical: 140 },
  { state: "Kuala Lumpur", total: 689, critical: 210 },
  { state: "Selangor", total: 794, critical: 250 },
  { state: "Terengganu", total: 849, critical: 230 },
];

export const recentActivity = alertRecords
  .filter((alert) => alert.category === "recent")
  .slice(0, 3);

