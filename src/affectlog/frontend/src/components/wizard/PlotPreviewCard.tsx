import React from "react";
import { BarChart2, Lock, Shield } from "lucide-react";
import clsx from "clsx";
import type { PlotCatalogEntry } from "../../content/plotCatalog";

interface PlotPreviewCardProps {
  plot: PlotCatalogEntry;
  selected: boolean;
  available: boolean;
  onToggle: (plotId: string) => void;
}

const PRIVACY_ICONS = {
  public: null,
  pseudonymised: <Shield size={11} className="text-amber-400" />,
  restricted: <Lock size={11} className="text-red-400" />,
};

export function PlotPreviewCard({ plot, selected, available, onToggle }: PlotPreviewCardProps) {
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => available && onToggle(plot.id)}
      className={clsx(
        "w-full rounded-xl border p-4 text-left transition-all",
        available && selected && "border-indigo-500/60 bg-indigo-500/10",
        available && !selected && "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/60",
        !available && "border-slate-700/30 bg-slate-800/10 opacity-40 cursor-not-allowed",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
            selected ? "bg-indigo-500/20" : "bg-slate-700/50",
          )}
        >
          <BarChart2 size={14} className={selected ? "text-indigo-400" : "text-slate-500"} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-300">{plot.label}</span>
            {PRIVACY_ICONS[plot.privacyLevel] && (
              <span className="flex items-center gap-1">
                {PRIVACY_ICONS[plot.privacyLevel]}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{plot.purpose}</p>
          {plot.limitations && (
            <p className="mt-1.5 text-[10px] text-slate-600 italic">{plot.limitations}</p>
          )}
          {!available && plot.unavailableMessage && (
            <p className="mt-1.5 text-[10px] text-amber-600">{plot.unavailableMessage}</p>
          )}
        </div>
      </div>
    </button>
  );
}
