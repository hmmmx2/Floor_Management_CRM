import clsx from "clsx";

type OverviewCardProps = {
  title: string;
  value: string;
  helper?: string;
  subLabel?: string;
  trend?: {
    label: string;
    direction: "up" | "down" | "flat";
  };
};

export default function OverviewCard({
  title,
  value,
  helper,
  subLabel,
  trend,
}: OverviewCardProps) {
  const trendColor =
    trend?.direction === "down"
      ? "text-primary-red"
      : trend?.direction === "flat"
        ? "text-dark-charcoal"
        : "text-status-green";

  return (
    <article className="rounded-2xl border border-light-grey bg-pure-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-dark-charcoal/70">
        {title}
      </p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-bold text-dark-charcoal">{value}</p>
        {trend && (
          <span className={clsx("text-sm font-semibold", trendColor)}>
            {trend.label}
          </span>
        )}
      </div>
      {helper && (
        <p className="mt-2 text-xs text-dark-charcoal/70">{helper}</p>
      )}
      {subLabel && (
        <p className="mt-1 text-sm font-semibold text-primary-red">
          {subLabel}
        </p>
      )}
    </article>
  );
}

