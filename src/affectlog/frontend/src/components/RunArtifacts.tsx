import React from "react";
import { FileJson, FileText, Download } from "lucide-react";

interface Props {
  artifacts: Record<string, string>;
  runId: string;
}

const ARTIFACT_META: Record<string, { label: string; desc: string; icon: React.ElementType; ext: string }> = {
  metrics:           { label: "Metrics JSON",          desc: "Gini, Coverage@K, sparsity, completeness",   icon: FileJson, ext: "json" },
  compliance_graph:  { label: "Compliance Graph",      desc: "JSON-LD graph (EU AI Act + GDPR)",            icon: FileJson, ext: "jsonld" },
  sop:               { label: "SOP Markdown",          desc: "Standard Operating Procedure document",       icon: FileText, ext: "md" },
  data_card:         { label: "Data Card",             desc: "Gebru et al. 2018 dataset documentation",     icon: FileJson, ext: "json" },
  privacy_report:    { label: "Privacy Report",        desc: "PII scan results and pseudonymisation log",   icon: FileJson, ext: "json" },
  eu_ai_act_annex_iv:{ label: "EU AI Act Annex IV",   desc: "Risk documentation per Annex IV",             icon: FileJson, ext: "json" },
  descriptive_stats: { label: "Descriptive Stats",     desc: "Actor/resource/verb distribution stats",      icon: FileJson, ext: "json" },
  concentration_metrics:{ label: "Concentration",      desc: "Gini and dominance metrics",                  icon: FileJson, ext: "json" },
  coverage_metrics:  { label: "Coverage Metrics",      desc: "Coverage@K values",                           icon: FileJson, ext: "json" },
  fairness_metrics:  { label: "Fairness Metrics",      desc: "Representation and balance ratios",           icon: FileJson, ext: "json" },
  temporal_stats:    { label: "Temporal Stats",        desc: "Time-series distribution",                    icon: FileJson, ext: "json" },
  dashboard_payload: { label: "Dashboard Payload",     desc: "Full dashboard JSON",                         icon: FileJson, ext: "json" },
};

export default function RunArtifacts({ artifacts, runId }: Props) {
  if (!artifacts || Object.keys(artifacts).length === 0) {
    return (
      <div className="card border-dashed border-slate-600 text-center py-6">
        <p className="text-slate-500 text-sm">No artifacts available yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-100 mb-1">
        Run Artifacts
      </h3>
      <p className="text-xs text-slate-500 mb-4 font-mono">{runId}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(artifacts).map(([key, path]) => {
          const meta = ARTIFACT_META[key];
          const Icon = meta?.icon ?? FileJson;
          return (
            <div
              key={key}
              className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors"
            >
              <Icon size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200">
                  {meta?.label ?? key}
                </div>
                {meta?.desc && (
                  <div className="text-xs text-slate-600 mt-0.5">{meta.desc}</div>
                )}
                <div className="text-xs text-slate-700 font-mono mt-0.5 truncate">{path}</div>
              </div>
              <Download size={13} className="text-slate-600 flex-shrink-0 mt-0.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
