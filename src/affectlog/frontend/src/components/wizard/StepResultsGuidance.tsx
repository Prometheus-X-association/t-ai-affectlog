import React from "react";
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Package } from "lucide-react";
import type { WizardRunResultsResponse } from "../../api/wizard";
import { OutputArtifactCard } from "./OutputArtifactCard";

interface StepResultsGuidanceProps {
  results: WizardRunResultsResponse | null;
  runId: string;
}

export function StepResultsGuidance({ results, runId }: StepResultsGuidanceProps) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Package size={20} className="text-slate-600" />
        <p className="text-sm text-slate-500">Results not yet available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Results & Guidance</h2>
        <p className="mt-1 text-xs text-slate-500">
          Assessment complete. Review findings, download artifacts, and act on recommendations.
        </p>
      </div>

      {results.key_findings.length > 0 && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-emerald-400">Key findings</p>
          <ul className="space-y-1.5">
            {results.key_findings.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <CheckCircle size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {results.what_was_analyzed.length > 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 space-y-2">
            <p className="text-xs font-medium text-slate-400">What was analyzed</p>
            <ul className="space-y-1">
              {results.what_was_analyzed.map((a) => (
                <li key={a} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                  {a.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.what_was_not_analyzed.length > 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 space-y-2">
            <p className="text-xs font-medium text-slate-400">What was not analyzed</p>
            <ul className="space-y-1">
              {results.what_was_not_analyzed.map((a) => (
                <li key={a} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <XCircle size={10} className="text-slate-600 flex-shrink-0" />
                  {a.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {results.recommended_next_actions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">Recommended next actions</p>
          <div className="space-y-2">
            {results.recommended_next_actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl border border-slate-700/50 bg-slate-800/20 p-3">
                <ArrowRight size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.developer_extension_suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">Developer extension suggestions</p>
          <div className="space-y-2">
            {results.developer_extension_suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                <Lightbulb size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.artifacts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">Artifacts ({results.artifacts.length})</p>
          <div className="space-y-1.5">
            {results.artifacts.map((a) => (
              <OutputArtifactCard key={a.filename} artifact={a} downloadable runId={runId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
