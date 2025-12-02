"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useTheme } from "@/lib/ThemeContext";
import { NodeData, getStatusLabel } from "@/lib/types";

type AlertType = "DANGER" | "WARNING" | "INACTIVE" | "NEW NODE" | "NORMAL";

type GeneratedAlert = {
  id: string;
  alert_type: AlertType;
  node_id: string;
  water_level: number;
  is_dead: boolean;
  latitude: number;
  longitude: number;
  timestamp: string;
  created_at: string;
  message: string;
};

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      fill="currentColor"
      {...props}
    >
      <path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
    </svg>
  );
}

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
    </svg>
  );
}

// Calendar Dropdown Component
function CalendarDropdown({
  selectedDate,
  onSelectDate,
  onClear,
  isDark,
}: {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClear: () => void;
  isDark: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = selected.toISOString().split("T")[0];
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  const handleToday = () => {
    const dateStr = today.toISOString().split("T")[0];
    onSelectDate(dateStr);
    setViewDate(today);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isSelectedDay = (day: number) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return (
      selected.getFullYear() === viewDate.getFullYear() &&
      selected.getMonth() === viewDate.getMonth() &&
      selected.getDate() === day
    );
  };

  const isToday = (day: number) => {
    return (
      today.getFullYear() === viewDate.getFullYear() &&
      today.getMonth() === viewDate.getMonth() &&
      today.getDate() === day
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
          selectedDate
            ? "border-primary-red bg-primary-red/10 text-primary-red"
            : isDark
              ? "border-dark-border text-dark-text hover:border-primary-red"
              : "border-light-grey text-dark-charcoal hover:border-primary-red"
        }`}
      >
        <CalendarIcon className="h-4 w-4" />
        {selectedDate
          ? new Date(selectedDate).toLocaleDateString("en-MY", { dateStyle: "medium" })
          : "Select Date"}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar */}
          <div
            className={`absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border p-4 shadow-xl ${
              isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"
            }`}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  isDark ? "hover:bg-dark-border" : "hover:bg-very-light-grey"
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  isDark ? "hover:bg-dark-border" : "hover:bg-very-light-grey"
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Day names */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className={`text-center text-xs font-semibold ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day !== null && (
                    <button
                      type="button"
                      onClick={() => handleSelectDate(day)}
                      className={`flex h-full w-full items-center justify-center rounded-lg text-sm font-medium transition ${
                        isSelectedDay(day)
                          ? "bg-primary-red text-pure-white"
                          : isToday(day)
                            ? isDark
                              ? "bg-primary-red/20 text-primary-red"
                              : "bg-light-red text-primary-red"
                            : isDark
                              ? "text-dark-text hover:bg-dark-border"
                              : "text-dark-charcoal hover:bg-very-light-grey"
                      }`}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer buttons */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleToday}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  isDark
                    ? "border-dark-border text-dark-text hover:bg-dark-border"
                    : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                }`}
              >
                Today
              </button>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="flex-1 rounded-xl bg-primary-red/10 px-3 py-2 text-sm font-semibold text-primary-red hover:bg-primary-red/20"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const typeFilterOptions = [
  { id: "all", label: "All Alerts" },
  { id: "danger", label: "Danger Only" },
  { id: "warning", label: "Warning Only" },
  { id: "inactive", label: "Inactive" },
  { id: "newnode", label: "New Nodes" },
];

const sortOrderOptions = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "severity-high", label: "High → Low Severity" },
  { id: "severity-low", label: "Low → High Severity" },
];

const alertTone = {
  DANGER: {
    border: "border-primary-red",
    background: "bg-light-red/60 dark:bg-primary-red/20",
    label: "text-primary-red",
    icon: "",
  },
  WARNING: {
    border: "border-status-warning-2",
    background: "bg-status-warning-2/15 dark:bg-status-warning-2/25",
    label: "text-status-warning-2",
    icon: "",
  },
  "NEW NODE": {
    border: "border-blue",
    background: "bg-light-blue dark:bg-blue/20",
    label: "text-blue",
    icon: "",
  },
  INACTIVE: {
    border: "border-purple",
    background: "bg-light-purple dark:bg-purple/20",
    label: "text-purple",
    icon: "",
  },
  NORMAL: {
    border: "border-status-green",
    background: "bg-status-green/15 dark:bg-status-green/20",
    label: "text-status-green",
    icon: "",
  },
};

const alertSeverity: Record<AlertType, number> = {
  DANGER: 4,
  WARNING: 3,
  INACTIVE: 2,
  "NEW NODE": 1,
  NORMAL: 0,
};

// Helper to generate alert type based on node data
function getAlertType(node: NodeData): AlertType {
  if (node.is_dead) return "INACTIVE";
  if (node.current_level >= 3) return "DANGER";
  if (node.current_level >= 2) return "WARNING";
  
  // Check if node is new (created within last 24 hours)
  const createdAt = new Date(node.created_at).getTime();
  const now = Date.now();
  const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
  if (hoursSinceCreation < 24) return "NEW NODE";
  
  return "NORMAL";
}

// Helper to generate alert message
function getAlertMessage(node: NodeData, alertType: AlertType): string {
  switch (alertType) {
    case "DANGER":
      return `Critical water level detected! Node ${node.node_id} is reporting ${node.current_level}ft water level. Immediate attention required.`;
    case "WARNING":
      return `Elevated water level detected at Node ${node.node_id}. Current level: ${node.current_level}ft. Monitor closely.`;
    case "INACTIVE":
      return `Node ${node.node_id} is offline and not reporting data. Last known water level: ${node.current_level}ft. Check sensor connection.`;
    case "NEW NODE":
      return `New sensor node ${node.node_id} has been deployed and is now active. Current water level: ${node.current_level}ft.`;
    default:
      return `Node ${node.node_id} is operating normally. Water level: ${node.current_level}ft.`;
  }
}

export default function AlertsPage() {
  const { isDark } = useTheme();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Read global settings from CRM Settings
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("crmSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        setIsLive(settings.liveDataEnabled ?? true);
        setRefreshInterval(settings.refreshInterval ?? 30000);
      }
    };
    loadSettings();
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Date filter state
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch nodes from API
  const fetchNodes = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }
      const result = await response.json();
      // API returns { success, data: [...], count, timestamp }
      const nodesData = Array.isArray(result) ? result : (result.data || []);
      setNodes(nodesData);
      setLastFetched(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLive) {
      interval = setInterval(fetchNodes, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNodes, isLive, refreshInterval]);

  // Generate alerts from nodes
  const alerts: GeneratedAlert[] = useMemo(() => {
    return nodes.map((node) => {
      const alertType = getAlertType(node);
      return {
        id: node._id,
        alert_type: alertType,
        node_id: node.node_id,
        water_level: node.current_level,
        is_dead: node.is_dead,
        latitude: node.latitude,
        longitude: node.longitude,
        timestamp: typeof node.last_updated === 'string' ? node.last_updated : node.last_updated.toISOString(),
        created_at: typeof node.created_at === 'string' ? node.created_at : node.created_at.toISOString(),
        message: getAlertMessage(node, alertType),
      };
    });
  }, [nodes]);

  // Filter and sort alerts
  const filteredAndSortedAlerts = useMemo(() => {
    let subset = [...alerts];

    // Filter by alert type
    if (activeTypeFilter === "danger") {
      subset = subset.filter((alert) => alert.alert_type === "DANGER");
    } else if (activeTypeFilter === "warning") {
      subset = subset.filter((alert) => alert.alert_type === "WARNING");
    } else if (activeTypeFilter === "inactive") {
      subset = subset.filter((alert) => alert.alert_type === "INACTIVE");
    } else if (activeTypeFilter === "newnode") {
      subset = subset.filter((alert) => alert.alert_type === "NEW NODE");
    }

    // Filter by selected date
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      subset = subset.filter((alert) => {
        const alertDate = new Date(alert.timestamp);
        return (
          alertDate.getFullYear() === filterDate.getFullYear() &&
          alertDate.getMonth() === filterDate.getMonth() &&
          alertDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Sort alerts
    subset.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();

      switch (sortOrder) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "severity-high":
          return alertSeverity[b.alert_type] - alertSeverity[a.alert_type];
        case "severity-low":
          return alertSeverity[a.alert_type] - alertSeverity[b.alert_type];
        default:
          return dateB - dateA;
      }
    });

    // Group by category (today, this week, older)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      critical: subset.filter((a) => a.alert_type === "DANGER" || a.alert_type === "WARNING"),
      today: subset.filter((a) => {
        const alertDate = new Date(a.timestamp);
        return alertDate >= today;
      }),
      thisWeek: subset.filter((a) => {
        const alertDate = new Date(a.timestamp);
        return alertDate < today && alertDate >= weekAgo;
      }),
      older: subset.filter((a) => {
        const alertDate = new Date(a.timestamp);
        return alertDate < weekAgo;
      }),
      all: subset,
    };
  }, [alerts, activeTypeFilter, sortOrder, selectedDate]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      danger: alerts.filter((a) => a.alert_type === "DANGER").length,
      warning: alerts.filter((a) => a.alert_type === "WARNING").length,
      inactive: alerts.filter((a) => a.alert_type === "INACTIVE").length,
      newNodes: alerts.filter((a) => a.alert_type === "NEW NODE").length,
      normal: alerts.filter((a) => a.alert_type === "NORMAL").length,
    };
  }, [alerts]);

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setActiveTypeFilter("all");
    setSortOrder("newest");
    setSelectedDate("");
  };

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  if (isLoading) {
    return (
      <section className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-light-grey border-t-primary-red" />
          <p className={`text-sm font-medium ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            Loading alerts from MongoDB...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex h-64 items-center justify-center">
        <div className={`rounded-3xl border p-8 text-center ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-red/10">
            <AlertTriangleIcon className="h-10 w-10 text-status-warning-2" />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            Connection Error
          </h3>
          <p className={`mt-1 text-sm ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            {error}
          </p>
          <button
            onClick={fetchNodes}
            className="mt-4 rounded-xl bg-primary-red px-4 py-2 text-sm font-semibold text-pure-white hover:bg-primary-red/90"
          >
            Retry Connection
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            Alerts Monitoring
          </h1>
          <p className={`text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            Real-time alerts from {nodes.length} IoT sensors connected to MongoDB
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live Status Indicator */}
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              isLive
                ? "bg-status-green/20 text-status-green"
                : isDark
                  ? "bg-dark-bg text-dark-text-secondary"
                  : "bg-very-light-grey text-dark-charcoal/70"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isLive ? "animate-pulse bg-status-green" : "bg-dark-charcoal/40"}`} />
            {isLive ? "Live" : "Paused"}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchNodes}
            className={`rounded-full p-2 transition-colors ${
              isDark ? "hover:bg-dark-bg text-dark-text-secondary" : "hover:bg-very-light-grey text-dark-charcoal/70"
            }`}
            title="Refresh now"
          >
            <RefreshIcon className="h-5 w-5" />
          </button>

          {/* Calendar Date Picker */}
          <CalendarDropdown
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onClear={clearDateFilter}
            isDark={isDark}
          />

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isDark
                ? "border-dark-border text-dark-text hover:border-primary-red hover:text-primary-red"
                : "border-light-grey text-dark-charcoal hover:border-primary-red hover:text-primary-red"
            }`}
          >
            <FilterIcon className="h-4 w-4" />
            Filter
            {(activeTypeFilter !== "all" || sortOrder !== "newest" || selectedDate) && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-red text-xs text-pure-white">
                !
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className={`rounded-2xl border p-4 ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <p className={`text-2xl font-bold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>{stats.total}</p>
          <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Total Nodes</p>
        </div>
        <div className={`rounded-2xl border p-4 border-primary-red/30 ${isDark ? "bg-primary-red/10" : "bg-light-red/30"}`}>
          <p className="text-2xl font-bold text-primary-red">{stats.danger}</p>
          <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Danger</p>
        </div>
        <div className={`rounded-2xl border p-4 border-status-warning-2/30 ${isDark ? "bg-status-warning-2/10" : "bg-status-warning-2/15"}`}>
          <p className="text-2xl font-bold text-status-warning-2">{stats.warning}</p>
          <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Warning</p>
        </div>
        <div className={`rounded-2xl border p-4 border-purple/30 ${isDark ? "bg-purple/10" : "bg-light-purple"}`}>
          <p className="text-2xl font-bold text-purple">{stats.inactive}</p>
          <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Inactive</p>
        </div>
        <div className={`rounded-2xl border p-4 border-blue/30 ${isDark ? "bg-blue/10" : "bg-light-blue"}`}>
          <p className="text-2xl font-bold text-blue">{stats.newNodes}</p>
          <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>New Nodes</p>
        </div>
        <div className={`rounded-2xl border p-4 border-status-green/30 ${isDark ? "bg-status-green/10" : "bg-status-green/15"}`}>
          <p className="text-2xl font-bold text-status-green">{stats.normal}</p>
          <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Normal</p>
        </div>
      </div>

      {/* Quick Type Filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilterOptions.map((option) => {
          const isActive = option.id === activeTypeFilter;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveTypeFilter(option.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                isActive
                  ? "bg-primary-red text-pure-white"
                  : isDark
                    ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                    : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Active Filters Summary */}
      <div className={`flex flex-wrap items-center gap-2 text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/60"}`}>
        <span>Showing:</span>
        {selectedDate && (
          <span className="flex items-center gap-1 rounded-full bg-primary-red/20 px-3 py-1 text-xs font-semibold text-primary-red">
            {new Date(selectedDate).toLocaleDateString("en-MY", { dateStyle: "medium" })}
            <button onClick={clearDateFilter} className="ml-1 hover:text-primary-red/70">×</button>
          </span>
        )}
        <span className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${isDark ? "bg-dark-bg text-dark-text" : "bg-very-light-grey text-dark-charcoal"}`}>
          {sortOrderOptions.find((s) => s.id === sortOrder)?.label}
        </span>
        <span>· {filteredAndSortedAlerts.all.length} alerts</span>
        {lastFetched && (
          <span className={`ml-auto text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/50"}`}>
            Last updated: {lastFetched.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Critical Alerts (Danger & Warning) */}
      {filteredAndSortedAlerts.critical.length > 0 && (
        <section className={`space-y-4 rounded-3xl border-2 border-primary-red/50 p-5 shadow-sm ${isDark ? "bg-primary-red/5" : "bg-light-red/20"}`}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-red">
              Critical Alerts
            </h2>
            <span className="rounded-full bg-primary-red px-3 py-1 text-xs font-bold text-pure-white">
              {filteredAndSortedAlerts.critical.length} ACTIVE
            </span>
          </div>
          <div className="space-y-3">
            {filteredAndSortedAlerts.critical.map((alert) => {
              const tone = alertTone[alert.alert_type];
              return (
                <article
                  key={alert.id}
                  className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-base font-semibold ${tone.label}`}>
                        {tone.icon} {alert.alert_type}
                      </p>
                      <p className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                        Node {alert.node_id} · Water Level: {alert.water_level} ft
                      </p>
                    </div>
                    <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                      {new Date(alert.timestamp).toLocaleString("en-MY", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                    {alert.latitude.toFixed(4)}°N, {alert.longitude.toFixed(4)}°E
                  </p>
                  <p className={`mt-2 text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                    {alert.message}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Today's Alerts */}
      <section className={`space-y-4 rounded-3xl border p-5 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            Today
          </h2>
          <span className={`text-xs uppercase tracking-wide transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
            {filteredAndSortedAlerts.today.length} alerts
          </span>
        </div>
        <div className="space-y-3">
          {filteredAndSortedAlerts.today.map((alert) => {
            const tone = alertTone[alert.alert_type];
            return (
              <article
                key={alert.id}
                className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-base font-semibold ${tone.label}`}>
                      {tone.icon} {alert.alert_type}
                    </p>
                    <p className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                      Node {alert.node_id} · Water Level: {alert.water_level} ft
                      {alert.is_dead && <span className="ml-2 text-xs text-purple">(Offline)</span>}
                    </p>
                  </div>
                  <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                    {new Date(alert.timestamp).toLocaleTimeString("en-MY", { timeStyle: "short" })}
                  </span>
                </div>
                <p className={`mt-1 text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  {alert.latitude.toFixed(4)}°N, {alert.longitude.toFixed(4)}°E
                </p>
                <p className={`mt-2 text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  {alert.message}
                </p>
              </article>
            );
          })}
          {filteredAndSortedAlerts.today.length === 0 && (
            <p className={`py-8 text-center text-sm font-semibold ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"}`}>
              No alerts for today matching your filters.
            </p>
          )}
        </div>
      </section>

      {/* This Week */}
      {filteredAndSortedAlerts.thisWeek.length > 0 && (
        <section className={`space-y-4 rounded-3xl border p-5 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              This Week
            </h2>
            <span className={`text-xs uppercase tracking-wide transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              {filteredAndSortedAlerts.thisWeek.length} alerts
            </span>
          </div>
          <div className="space-y-3">
            {filteredAndSortedAlerts.thisWeek.map((alert) => {
              const tone = alertTone[alert.alert_type];
              return (
                <article
                  key={alert.id}
                  className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-base font-semibold ${tone.label}`}>
                        {tone.icon} {alert.alert_type}
                      </p>
                      <p className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                        Node {alert.node_id} · Water Level: {alert.water_level} ft
                      </p>
                    </div>
                    <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                      {new Date(alert.timestamp).toLocaleDateString("en-MY", { dateStyle: "medium" })}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                    {alert.message}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Older Alerts */}
      {filteredAndSortedAlerts.older.length > 0 && (
        <section className={`space-y-4 rounded-3xl border p-5 shadow-sm transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Older
            </h2>
            <span className={`text-xs uppercase tracking-wide transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              {filteredAndSortedAlerts.older.length} alerts
            </span>
          </div>
          <div className="space-y-3">
            {filteredAndSortedAlerts.older.slice(0, 10).map((alert) => {
              const tone = alertTone[alert.alert_type];
              return (
                <article
                  key={alert.id}
                  className={`rounded-2xl border px-4 py-3 ${tone.border} ${tone.background}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-base font-semibold ${tone.label}`}>
                        {tone.icon} {alert.alert_type}
                      </p>
                      <p className={`text-sm font-semibold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                        Node {alert.node_id} · Water Level: {alert.water_level} ft
                      </p>
                    </div>
                    <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                      {new Date(alert.timestamp).toLocaleDateString("en-MY", { dateStyle: "medium" })}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                    {alert.message}
                  </p>
                </article>
              );
            })}
            {filteredAndSortedAlerts.older.length > 10 && (
              <p className={`text-center text-sm ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                + {filteredAndSortedAlerts.older.length - 10} more older alerts
              </p>
            )}
          </div>
        </section>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-xl transition-colors ${isDark ? "bg-dark-card" : "bg-pure-white"}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                Filter Alerts
              </h2>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className={`rounded-full p-2 transition-colors ${
                  isDark ? "text-dark-text-muted hover:bg-dark-bg hover:text-dark-text" : "text-dark-charcoal/60 hover:bg-very-light-grey hover:text-dark-charcoal"
                }`}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Date Filter */}
              <div>
                <label className={`block text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Filter by Date
                </label>
                <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  Show alerts from a specific date
                </p>
                <div className="mt-3">
                  <CalendarDropdown
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onClear={clearDateFilter}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className={`block text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Sort Order
                </label>
                <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  Order alerts by date or severity
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {sortOrderOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSortOrder(option.id)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        sortOrder === option.id
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Type */}
              <div>
                <label className={`block text-sm font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
                  Alert Type
                </label>
                <p className={`text-xs transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                  Show specific alert types
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeFilterOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setActiveTypeFilter(option.id)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                        activeTypeFilter === option.id
                          ? "bg-primary-red text-pure-white"
                          : isDark
                            ? "border border-dark-border text-dark-text-secondary hover:border-primary-red/60"
                            : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                  isDark ? "border-dark-border text-dark-text-secondary hover:bg-dark-bg" : "border-light-grey text-dark-charcoal hover:bg-very-light-grey"
                }`}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
