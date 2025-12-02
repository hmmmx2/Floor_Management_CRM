"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import StatusPill from "@/components/common/StatusPill";
import { useTheme } from "@/lib/ThemeContext";
import { NodeData, getWaterLevelStatus, getNodeStatus } from "@/lib/types";
import { usePermissions } from "@/lib/hooks/usePermissions";

// Export Icon
function ExportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

// Transform NodeData for table display
interface SensorTableRow {
  id: string;
  node_id: string;
  latitude: number;
  longitude: number;
  water_level: number;
  is_dead: boolean;
  status: string;
  node_status: string;
  last_updated: string;
  created_at: string;
}

type SortConfig = {
  key: keyof SensorTableRow;
  direction: "asc" | "desc";
};

const columns: { key: keyof SensorTableRow; label: string; sortable?: boolean }[] = [
  { key: "node_id", label: "Node ID", sortable: true },
  { key: "water_level", label: "Water Level", sortable: true },
  { key: "latitude", label: "Latitude", sortable: true },
  { key: "longitude", label: "Longitude", sortable: true },
  { key: "status", label: "Water Status", sortable: true },
  { key: "node_status", label: "Node Status", sortable: true },
  { key: "last_updated", label: "Last Updated", sortable: true },
  { key: "created_at", label: "Created At", sortable: true },
];

export default function SensorsPage() {
  const { isDark } = useTheme();
  const { canExport, canManageSensors, role } = usePermissions();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nodeStatusFilter, setNodeStatusFilter] = useState<string>("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Read global settings from CRM Settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("crmSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        setAutoRefresh(settings.liveDataEnabled ?? true);
        setRefreshInterval(settings.refreshInterval ?? 30000);
      }
    };
    loadSettings();
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  // Fetch nodes data from API
  const fetchNodes = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }

      const result = await response.json();

      if (result.success) {
        setNodes(result.data);
        setLastFetch(new Date());
        setError(null);
      } else {
        throw new Error(result.error || "Failed to fetch nodes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchNodes();

    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchNodes, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNodes, autoRefresh, refreshInterval]);

  // Transform nodes to table rows
  const tableRows: SensorTableRow[] = useMemo(() => {
    return nodes.map((node) => {
      const waterStatus = getWaterLevelStatus(node.current_level);
      const nodeStatus = getNodeStatus(node.is_dead);

      return {
        id: node._id,
        node_id: node.node_id,
        latitude: node.latitude,
        longitude: node.longitude,
        water_level: node.current_level,
        is_dead: node.is_dead,
        status: waterStatus.label,
        node_status: nodeStatus.label,
        last_updated: new Date(node.last_updated).toLocaleString("en-MY", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        created_at: new Date(node.created_at).toLocaleString("en-MY", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
    });
  }, [nodes]);

  // Filter and sort rows
  const filteredRows = useMemo(() => {
    let result = tableRows;

    // Search filter
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      result = result.filter(
        (row) =>
          row.node_id.toLowerCase().includes(query) ||
          row.status.toLowerCase().includes(query) ||
          row.node_status.toLowerCase().includes(query)
      );
    }

    // Water status filter
    if (statusFilter !== "all") {
      result = result.filter((row) => {
        switch (statusFilter) {
          case "normal":
            return row.water_level === 0;
          case "alert":
            return row.water_level === 1;
          case "warning":
            return row.water_level === 2;
          case "critical":
            return row.water_level === 3;
          default:
            return true;
        }
      });
    }

    // Node status filter
    if (nodeStatusFilter !== "all") {
      result = result.filter((row) => {
        if (nodeStatusFilter === "online") return !row.is_dead;
        if (nodeStatusFilter === "offline") return row.is_dead;
        return true;
      });
    }

    // Sort
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tableRows, searchValue, sortConfig, statusFilter, nodeStatusFilter]);

  const handleSort = (key: keyof SensorTableRow) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Get status pill variant
  const getStatusVariant = (level: number): "green" | "yellow" | "orange" | "red" => {
    switch (level) {
      case 0:
        return "green";
      case 1:
        return "yellow";
      case 2:
        return "orange";
      case 3:
        return "red";
      default:
        return "green";
    }
  };

  // Escape XML special characters
  const escapeXml = (str: string): string => {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Node ID", "Water Level (ft)", "Latitude", "Longitude", "Water Status", "Node Status", "Last Updated", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredRows.map((row) =>
        [
          `"${row.node_id}"`,
          row.water_level,
          row.latitude,
          row.longitude,
          `"${row.status}"`,
          `"${row.node_status}"`,
          `"${row.last_updated}"`,
          `"${row.created_at}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sensor-data-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to Excel
  const exportToExcel = () => {
    const headers = ["Node ID", "Water Level (ft)", "Latitude", "Longitude", "Water Status", "Node Status", "Last Updated", "Created At"];
    
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#ED1C24" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center"/>
    </Style>
    <Style ss:ID="Data">
      <Alignment ss:Horizontal="Left"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Sensor Data">
    <Table>
      <Row>
        ${headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("")}
      </Row>
      ${filteredRows
        .map(
          (row) => `<Row>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(row.node_id)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="Number">${row.water_level}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="Number">${row.latitude}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="Number">${row.longitude}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(row.status)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(row.node_status)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(row.last_updated)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(row.created_at)}</Data></Cell>
      </Row>`
        )
        .join("")}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sensor-data-${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: nodes.length,
      online: nodes.filter((n) => !n.is_dead).length,
      offline: nodes.filter((n) => n.is_dead).length,
      normal: nodes.filter((n) => n.current_level === 0).length,
      alert: nodes.filter((n) => n.current_level === 1).length,
      warning: nodes.filter((n) => n.current_level === 2).length,
      critical: nodes.filter((n) => n.current_level === 3).length,
    };
  }, [nodes]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`h-12 w-12 animate-spin rounded-full border-4 ${isDark ? "border-dark-border border-t-primary-red" : "border-light-grey border-t-primary-red"}`} />
            <p className={`text-sm font-medium ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
              Loading sensor data...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className={`rounded-3xl border p-8 text-center ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-red/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary-red">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
              Connection Error
            </h2>
            <p className={`text-sm mb-4 ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
              {error}
            </p>
            <button
              type="button"
              onClick={fetchNodes}
              className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-semibold transition-colors ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>
            IoT Sensor Networks
          </h1>
          <p className={`text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"}`}>
            Real-time monitoring of {stats.total} flood sensor nodes from MongoDB
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Live status indicator */}
          {lastFetch && (
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-status-green animate-pulse" : "bg-dark-charcoal/40"}`} />
              <span className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                {autoRefresh ? "Live" : "Paused"} | Updated: {lastFetch.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Manual refresh */}
          <button
            type="button"
            onClick={fetchNodes}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isDark
                ? "border-dark-border text-dark-text hover:border-primary-red hover:text-primary-red"
                : "border-light-grey text-dark-charcoal hover:border-primary-red hover:text-primary-red"
            }`}
            title="Refresh data"
          >
            <RefreshIcon className="h-4 w-4" />
          </button>

          {/* Export Dropdown - Only show if user has permission */}
          {canExport && (
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={filteredRows.length === 0}
                className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isDark
                    ? "border-dark-border text-dark-text hover:border-primary-red hover:text-primary-red"
                    : "border-light-grey text-dark-charcoal hover:border-primary-red hover:text-primary-red"
                }`}
              >
                <ExportIcon className="h-4 w-4" />
                Export
              </button>

              {showExportMenu && (
                <div className={`absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border shadow-lg ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
                  <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>
                    Export {filteredRows.length} rows
                  </div>
                  <div className={`border-t ${isDark ? "border-dark-border" : "border-light-grey"}`} />
                  <button
                    type="button"
                    onClick={() => { exportToCSV(); setShowExportMenu(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition ${isDark ? "text-dark-text hover:bg-dark-bg" : "text-dark-charcoal hover:bg-very-light-grey"}`}
                  >
                    <svg className="h-5 w-5 text-status-green" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 17h8v-2H8v2zm0-4h8v-2H8v2z"/>
                    </svg>
                    <div>
                      <p>Export as CSV</p>
                      <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Comma-separated values</p>
                    </div>
                  </button>
                  <div className={`border-t ${isDark ? "border-dark-border" : "border-light-grey"}`} />
                  <button
                    type="button"
                    onClick={() => { exportToExcel(); setShowExportMenu(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition ${isDark ? "text-dark-text hover:bg-dark-bg" : "text-dark-charcoal hover:bg-very-light-grey"}`}
                  >
                    <svg className="h-5 w-5 text-status-green" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM9.5 11h5l-2.5 4 2.5 4h-5l-2.5-4 2.5-4z"/>
                    </svg>
                    <div>
                      <p>Export as Excel (.xlsx)</p>
                      <p className={`text-xs ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Microsoft Excel format</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Total Nodes</p>
          <p className={`mt-1 text-2xl font-bold ${isDark ? "text-dark-text" : "text-dark-charcoal"}`}>{stats.total}</p>
        </div>
        <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Online / Offline</p>
          <p className="mt-1 text-2xl font-bold">
            <span className="text-status-green">{stats.online}</span>
            <span className={isDark ? "text-dark-text-muted" : "text-dark-charcoal/40"}> / </span>
            <span className="text-status-danger">{stats.offline}</span>
          </p>
        </div>
        <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Water Levels</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-status-green/20 px-1.5 py-0.5 text-xs font-bold text-status-green">{stats.normal}</span>
            <span className="rounded bg-status-warning-1/20 px-1.5 py-0.5 text-xs font-bold text-status-warning-1">{stats.alert}</span>
            <span className="rounded bg-status-warning-2/20 px-1.5 py-0.5 text-xs font-bold text-status-warning-2">{stats.warning}</span>
            <span className="rounded bg-status-danger/20 px-1.5 py-0.5 text-xs font-bold text-status-danger">{stats.critical}</span>
          </div>
        </div>
        <div className={`rounded-2xl border p-4 transition-colors ${isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/60"}`}>Critical Alerts</p>
          <p className={`mt-1 text-2xl font-bold ${stats.critical > 0 ? "text-status-danger" : "text-status-green"}`}>{stats.critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className={`flex flex-1 min-w-[220px] items-center gap-2 rounded-full border border-primary-red px-4 py-2 text-sm transition-colors ${isDark ? "bg-dark-card text-dark-text" : "bg-pure-white text-dark-charcoal"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-primary-red" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5L21 21" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by Node ID..."
            className={`w-full border-none bg-transparent text-sm outline-none transition-colors ${isDark ? "placeholder:text-dark-text-muted" : "placeholder:text-dark-charcoal/60"}`}
          />
        </div>

        {/* Water Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card text-dark-text"
              : "border-light-grey bg-pure-white text-dark-charcoal"
          }`}
        >
          <option value="all">All Water Levels</option>
          <option value="normal">Normal (0ft)</option>
          <option value="alert">Alert (1ft)</option>
          <option value="warning">Warning (2ft)</option>
          <option value="critical">Critical (3ft)</option>
        </select>

        {/* Node Status Filter */}
        <select
          value={nodeStatusFilter}
          onChange={(e) => setNodeStatusFilter(e.target.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            isDark
              ? "border-dark-border bg-dark-card text-dark-text"
              : "border-light-grey bg-pure-white text-dark-charcoal"
          }`}
        >
          <option value="all">All Nodes</option>
          <option value="online">Online Only</option>
          <option value="offline">Offline Only</option>
        </select>
      </div>

      {/* Data Table */}
      <div className={`overflow-x-auto rounded-3xl border transition-colors ${isDark ? "border-dark-border" : "border-light-grey"}`}>
        <table className={`min-w-[960px] w-full border-collapse text-left text-sm transition-colors ${isDark ? "text-dark-text-secondary" : "text-dark-charcoal"}`}>
          <thead className={`text-xs uppercase tracking-wide transition-colors ${isDark ? "bg-dark-bg text-dark-text-muted" : "bg-light-red text-dark-charcoal"}`}>
            <tr>
              {columns.map((column) => {
                const isSorted = sortConfig?.key === column.key;
                return (
                  <th
                    key={column.key}
                    className={`border px-4 py-3 font-semibold ${isDark ? "border-dark-border" : "border-light-red"}`}
                  >
                    {column.sortable ? (
                      <button type="button" onClick={() => handleSort(column.key)} className="flex items-center gap-2">
                        {column.label}
                        {isSorted && <span className="text-primary-red">{sortConfig?.direction === "asc" ? "▲" : "▼"}</span>}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr
                key={row.id}
                className={clsx(
                  "border transition-colors",
                  isDark ? "border-dark-border" : "border-light-red",
                  index % 2 === 0
                    ? isDark ? "bg-dark-card" : "bg-pure-white"
                    : isDark ? "bg-dark-bg" : "bg-light-red/20"
                )}
              >
                <td className={`px-4 py-3 font-semibold ${isDark ? "text-dark-text" : ""}`}>{row.node_id}</td>
                <td className="px-4 py-3 text-primary-red font-bold">{row.water_level} ft</td>
                <td className="px-4 py-3">{row.latitude.toFixed(6)}</td>
                <td className="px-4 py-3">{row.longitude.toFixed(6)}</td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status.split(" ")[0]} variant={getStatusVariant(row.water_level)} />
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    row.is_dead
                      ? "bg-status-danger/20 text-status-danger"
                      : "bg-status-green/20 text-status-green"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${row.is_dead ? "bg-status-danger" : "bg-status-green"}`} />
                    {row.node_status}
                  </span>
                </td>
                <td className="px-4 py-3">{row.last_updated}</td>
                <td className="px-4 py-3">{row.created_at}</td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-4 py-6 text-center text-sm font-semibold transition-colors ${isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"}`}
                >
                  No nodes match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
