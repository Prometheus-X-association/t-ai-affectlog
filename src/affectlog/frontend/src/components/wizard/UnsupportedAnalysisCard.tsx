import React from "react";
import { Lock, ArrowRight } from "lucide-react";
import type { ScopeItem } from "../../api/wizard";

interface UnsupportedAnalysisCardProps {
  item: ScopeItem;
}

export function UnsupportedAnalysisCard({ item }: UnsupportedAnalysisCardProps) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 opacity-60 hover:opacity-80 transition-opacity">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-slate-700/50">
          <Lock size={14} className="text-slate-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-400">{item.label}</span>
            <span className="inline-flex items-center rounded-full border border-slate-600/30 bg-slate-700/30 px-2 py-0.5 text-xs text-slate-500">
              {item.status === "conditional" ? "Needs more input" : "Out of scope"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.why}</p>
          {item.required_inputs.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowRight size={11} />
              <span>Requires: {item.required_inputs.join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
