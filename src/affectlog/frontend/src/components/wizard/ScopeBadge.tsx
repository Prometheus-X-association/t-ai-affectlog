import React from "react";
import clsx from "clsx";

type ScopeStatus = "available" | "conditional" | "out_of_scope";

interface ScopeBadgeProps {
  status: ScopeStatus;
  compact?: boolean;
}

const CONFIG: Record<ScopeStatus, { label: string; className: string }> = {
  available: {
    label: "Available",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  conditional: {
    label: "Conditional",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  out_of_scope: {
    label: "Out of scope",
    className: "bg-slate-700/50 text-slate-500 border-slate-600/30",
  },
};

export function ScopeBadge({ status, compact = false }: ScopeBadgeProps) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-medium",
        compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      {label}
    </span>
  );
}
