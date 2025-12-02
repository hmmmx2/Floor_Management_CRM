import clsx from "clsx";

import { NodeStatus, statusToneMap } from "@/lib/data";

type StatusPillProps = {
  status: string;
  variant?: "green" | "yellow" | "orange" | "red";
};

// Variant-based tone map for custom status labels
const variantToneMap = {
  green: {
    bg: "bg-status-green/15",
    text: "text-status-green",
    border: "border-status-green/30",
    dot: "bg-status-green",
  },
  yellow: {
    bg: "bg-status-warning-1/20",
    text: "text-status-warning-1",
    border: "border-status-warning-1/30",
    dot: "bg-status-warning-1",
  },
  orange: {
    bg: "bg-status-warning-2/20",
    text: "text-status-warning-2",
    border: "border-status-warning-2/30",
    dot: "bg-status-warning-2",
  },
  red: {
    bg: "bg-light-red",
    text: "text-primary-red",
    border: "border-primary-red/30",
    dot: "bg-primary-red",
  },
};

export default function StatusPill({ status, variant }: StatusPillProps) {
  // Use variant if provided, otherwise fall back to status-based lookup
  let tone;
  
  if (variant) {
    tone = variantToneMap[variant];
  } else {
    // Try to find in statusToneMap
    tone = statusToneMap[status as NodeStatus];
  }

  // Default fallback if no tone found
  if (!tone) {
    tone = variantToneMap.green;
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tone.bg,
        tone.text,
        tone.border
      )}
    >
      <span
        className={clsx("h-2 w-2 rounded-full", tone.dot)}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
