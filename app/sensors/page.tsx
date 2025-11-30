"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

import StatusPill from "@/components/common/StatusPill";
import {
  SensorTableRow,
  deriveStatusFromLevel,
  sensorsTableData,
} from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

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

const nodeFilterOptions = [
  { label: "Node 1", value: "node_1" },
  { label: "Node 2", value: "node_2" },
  { label: "Node 3", value: "node_3" },
];

const columns: { key: keyof SensorTableRow; label: string; sortable?: boolean }[] =
  [
    { key: "node_label", label: "Node", sortable: true },
    { key: "water_level", label: "Water Level", sortable: true },
    { key: "area", label: "Area", sortable: true },
    { key: "location", label: "Location" },
    { key: "state", label: "State", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "last_update", label: "Last Update", sortable: true },
    { key: "timestamp", label: "Timestamp", sortable: true },
  ];

type SortConfig = {
  key: keyof SensorTableRow;
  direction: "asc" | "desc";
};

export default function SensorsPage() {
  const { isDark } = useTheme();
  const [rows, setRows] = useState<SensorTableRow[]>(sensorsTableData);
  const [visibleNodes, setVisibleNodes] = useState<string[]>(
    nodeFilterOptions.map((option) => option.value)
  );
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filteredRows = useMemo(() => {
    let result = rows.filter((row) => visibleNodes.includes(row.node_id));

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      result = result.filter(
        (row) =>
          row.node_label.toLowerCase().includes(query) ||
          row.area.toLowerCase().includes(query) ||
          row.location.toLowerCase().includes(query) ||
          row.state.toLowerCase().includes(query) ||
          row.status.toLowerCase().includes(query)
      );
    }

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
  }, [rows, visibleNodes, searchValue, sortConfig]);

  const toggleNodeFilter = (nodeId: string) => {
    setVisibleNodes((current) =>
      current.includes(nodeId)
        ? current.filter((id) => id !== nodeId)
        : [...current, nodeId]
    );
  };

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

  const createNewRow = (): SensorTableRow => {
    const randomLevel = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
    const selectedNode = visibleNodes[0] ?? "node_1";
    const nodeLabel = `Node No. ${selectedNode.split("_")[1]}`;
    const now = new Date();

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      node_id: selectedNode,
      node_label: nodeLabel,
      water_level: randomLevel,
      area: ["Kuching", "Waterfront", "Jalan Satok", "Padungan"][
        Math.floor(Math.random() * 4)
      ],
      location: `Latitude: ${(1.55 + Math.random() * 0.02).toFixed(
        4
      )}° N, Longitude: ${(110.34 + Math.random() * 0.02).toFixed(4)}° E`,
      state: "Sarawak",
      status: deriveStatusFromLevel(randomLevel),
      last_update: "Just now",
      timestamp: now.toISOString(),
    };
  };

  const addRow = () => {
    setRows((current) => [createNewRow(), ...current]);
  };

  const removeRow = (rowId?: string) => {
    setRows((current) => {
      if (current.length === 0) return current;
      if (rowId) {
        return current.filter((row) => row.id !== rowId);
      }
      return current.slice(0, -1);
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Node", "Water Level (ft)", "Area", "Location", "State", "Status", "Last Update", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...filteredRows.map((row) =>
        [
          `"${row.node_label}"`,
          row.water_level,
          `"${row.area}"`,
          `"${row.location}"`,
          `"${row.state}"`,
          `"${row.status}"`,
          `"${row.last_update}"`,
          `"${new Date(row.timestamp).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })}"`,
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

  // Export to Excel (XLSX format using XML)
  const exportToExcel = () => {
    const headers = ["Node", "Water Level (ft)", "Area", "Location", "State", "Status", "Last Update", "Timestamp"];
    
    // Create XML spreadsheet
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
        ${headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join("")}
      </Row>
      ${filteredRows
        .map(
          (row) => `<Row>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${row.node_label}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="Number">${row.water_level}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${row.area}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${row.location}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${row.state}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${row.status}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${row.last_update}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${new Date(row.timestamp).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })}</Data></Cell>
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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className={`text-3xl font-semibold transition-colors ${
              isDark ? "text-dark-text" : "text-dark-charcoal"
            }`}
          >
            IoT Sensor Networks
          </h1>
          <p
            className={`text-sm transition-colors ${
              isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
            }`}
          >
            Filter Node 1 to 3, triage anomalies, and manage the live grid.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Export Dropdown */}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 transition-transform ${showExportMenu ? "rotate-180" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showExportMenu && (
              <div
                className={`absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border shadow-lg ${
                  isDark ? "border-dark-border bg-dark-card" : "border-light-grey bg-pure-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    exportToCSV();
                    setShowExportMenu(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition ${
                    isDark
                      ? "text-dark-text hover:bg-dark-bg"
                      : "text-dark-charcoal hover:bg-very-light-grey"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-status-green"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 18v-1h2v1h-2zm0-2v-1h2v1h-2zm0-2v-1h2v1h-2zm4 4v-1h3v1h-3zm0-2v-1h3v1h-3zm0-2v-1h3v1h-3z" />
                  </svg>
                  Export as CSV
                </button>
                <div className={`border-t ${isDark ? "border-dark-border" : "border-light-grey"}`} />
                <button
                  type="button"
                  onClick={() => {
                    exportToExcel();
                    setShowExportMenu(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition ${
                    isDark
                      ? "text-dark-text hover:bg-dark-bg"
                      : "text-dark-charcoal hover:bg-very-light-grey"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-status-green"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM7 17h2v-4H7v4zm4 0h2v-6h-2v6zm4 0h2v-2h-2v2z" />
                  </svg>
                  Export as Excel
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="rounded-full bg-primary-red px-5 py-2 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
          >
            Add Row
          </button>
          <button
            type="button"
            onClick={() => removeRow()}
            disabled={rows.length === 0}
            className={`rounded-full border border-primary-red px-5 py-2 text-sm font-semibold text-primary-red transition hover:bg-light-red/40 disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark ? "hover:bg-primary-red/20" : ""
            }`}
          >
            Delete Row
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <div
          className={`flex flex-1 min-w-[220px] items-center gap-2 rounded-full border border-primary-red px-4 py-2 text-sm transition-colors ${
            isDark ? "bg-dark-card text-dark-text" : "bg-pure-white text-dark-charcoal"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 text-primary-red"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5L21 21" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search Nodes"
            className={`w-full border-none bg-transparent text-sm outline-none transition-colors ${
              isDark
                ? "placeholder:text-dark-text-muted"
                : "placeholder:text-dark-charcoal/60"
            }`}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {nodeFilterOptions.map((option) => {
            const isActive = visibleNodes.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleNodeFilter(option.value)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                  isActive
                    ? "border-primary-red bg-light-red text-primary-red dark:bg-primary-red/20"
                    : isDark
                      ? "border-dark-border text-dark-text-secondary hover:border-primary-red/50"
                      : "border-light-grey text-dark-charcoal hover:border-primary-red/50"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`overflow-x-auto rounded-3xl border transition-colors ${
          isDark ? "border-dark-border" : "border-dark-charcoal"
        }`}
      >
        <table
          className={`min-w-[960px] w-full border-collapse text-left text-sm transition-colors ${
            isDark ? "text-dark-text-secondary" : "text-dark-charcoal"
          }`}
        >
          <thead
            className={`text-xs uppercase tracking-wide transition-colors ${
              isDark
                ? "bg-dark-bg text-dark-text-muted"
                : "bg-light-red text-dark-charcoal"
            }`}
          >
            <tr>
              {columns.map((column) => {
                const isSorted = sortConfig?.key === column.key;
                return (
                  <th
                    key={column.key}
                    className={`border px-4 py-3 font-semibold ${
                      isDark ? "border-dark-border" : "border-light-red"
                    }`}
                    aria-sort={
                      column.sortable
                        ? isSorted
                          ? sortConfig?.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-2"
                      >
                        {column.label}
                        {isSorted && (
                          <span className="text-primary-red">
                            {sortConfig?.direction === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
              <th
                className={`border px-4 py-3 font-semibold ${
                  isDark ? "border-dark-border" : "border-light-red"
                }`}
              >
                Actions
              </th>
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
                    ? isDark
                      ? "bg-dark-card"
                      : "bg-pure-white"
                    : isDark
                      ? "bg-dark-bg"
                      : "bg-light-red/20"
                )}
              >
                <td
                  className={`px-4 py-3 font-semibold ${
                    isDark ? "text-dark-text" : ""
                  }`}
                >
                  {row.node_label}
                </td>
                <td className="px-4 py-3 text-primary-red">
                  {row.water_level} ft
                </td>
                <td className="px-4 py-3">{row.area}</td>
                <td className="px-4 py-3">{row.location}</td>
                <td className="px-4 py-3">{row.state}</td>
                <td className="px-4 py-3">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-3">{row.last_update}</td>
                <td className="px-4 py-3">
                  {new Date(row.timestamp).toLocaleString("en-MY", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-sm font-semibold text-primary-red hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className={`px-4 py-6 text-center text-sm font-semibold transition-colors ${
                    isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"
                  }`}
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
