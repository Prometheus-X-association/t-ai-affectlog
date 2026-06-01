import React from "react";
import clsx from "clsx";

interface Props {
  actorGini: number | null;
  resourceGini: number | null;
  uniqueActors?: number | null;
  uniqueResources?: number | null;
}

function giniColor(g: number): string {
  if (g >= 0.7) return "bg-red-500";
  if (g >= 0.5) return "bg-amber-500";
  return "bg-emerald-500";
}

function giniLabel(g: number): { text: string; badge: string } {
  if (g >= 0.7) return { text: "High concentration", badge: "badge-err" };
  if (g >= 0.5) return { text: "Moderate concentration", badge: "badge-warn" };
  return { text: "Low concentration", badge: "badge-ok" };
}

function GiniBar({ label, value, count, countLabel }: {
  label: string; value: number | null; count?: number | null; countLabel: string;
}) {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  const { text, badge } = giniLabel(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-slate-200">{label}</span>
          {count != null && (
            <span className="ml-2 text-xs text-slate-500">({count.toLocaleString()} {countLabel})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={badge}>{text}</span>
          <span className="text-lg font-bold text-white">{value.toFixed(3)}</span>
        </div>
      </div>
      <div className="gini-bar-bg">
        <div
          className={clsx("gini-bar-fill", giniColor(value))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Scale labels */}
      <div className="flex justify-between text-xs text-slate-700">
        <span>0 · Equal</span>
        <span>0.5</span>
        <span>1 · Max inequality</span>
      </div>
    </div>
  );
}

export default function GiniChart({ actorGini, resourceGini, uniqueActors, uniqueResources }: Props) {
  return (
    <div className="card space-y-6">
      <div>
        <h3 className="font-semibold text-slate-100 mb-1">Gini Concentration Index</h3>
        <p className="text-xs text-slate-500">
          Measures how unevenly activity is distributed. 0 = perfectly equal; 1 = one entity dominates.
        </p>
      </div>
      <GiniBar label="Actor (User) Gini" value={actorGini} count={uniqueActors} countLabel="actors" />
      <GiniBar label="Resource Gini" value={resourceGini} count={uniqueResources} countLabel="resources" />
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700">
        {[
          { range: "0.0 – 0.49", label: "Low", color: "bg-emerald-500" },
          { range: "0.5 – 0.69", label: "Moderate", color: "bg-amber-500" },
          { range: "0.7 – 1.0", label: "High", color: "bg-red-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-xs text-slate-500">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span>{l.label} ({l.range})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
