import clsx from "clsx";

import { NodeStatus, statusToneMap } from "@/lib/data";

type StatusPillProps = {
  status: NodeStatus;
};

export default function StatusPill({ status }: StatusPillProps) {
  const tone = statusToneMap[status];

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

