"use client";

import clsx from "clsx";

import { useTheme } from "@/lib/ThemeContext";

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
  const { isDark } = useTheme();

  const trendColor =
    trend?.direction === "down"
      ? "text-primary-red"
      : trend?.direction === "flat"
        ? isDark
          ? "text-dark-text"
          : "text-dark-charcoal"
        : "text-status-green";

  return (
    <article
      className={clsx(
        "rounded-2xl border p-5 shadow-sm transition-colors",
        isDark
          ? "border-dark-border bg-dark-card"
          : "border-light-grey bg-pure-white"
      )}
    >
      <p
        className={clsx(
          "text-sm font-semibold uppercase tracking-wide",
          isDark ? "text-dark-text-secondary" : "text-dark-charcoal/70"
        )}
      >
        {title}
      </p>
      <div className="mt-3 flex items-end justify-between">
        <p
          className={clsx(
            "text-3xl font-bold",
            isDark ? "text-dark-text" : "text-dark-charcoal"
          )}
        >
          {value}
        </p>
        {trend && (
          <span className={clsx("text-sm font-semibold", trendColor)}>
            {trend.label}
          </span>
        )}
      </div>
      {helper && (
        <p
          className={clsx(
            "mt-2 text-xs",
            isDark ? "text-dark-text-muted" : "text-dark-charcoal/70"
          )}
        >
          {helper}
        </p>
      )}
      {subLabel && (
        <p className="mt-1 text-sm font-semibold text-primary-red">
          {subLabel}
        </p>
      )}
    </article>
  );
}
