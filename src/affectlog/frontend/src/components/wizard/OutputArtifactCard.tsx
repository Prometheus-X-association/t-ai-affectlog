import React from "react";
import { FileText, Download, Shield } from "lucide-react";
import clsx from "clsx";
import type { OutputContractArtifact } from "../../api/wizard";

interface OutputArtifactCardProps {
  artifact: OutputContractArtifact;
  downloadable?: boolean;
  runId?: string;
}

const FORMAT_COLORS: Record<string, string> = {
  json: "text-blue-400",
  jsonl: "text-blue-400",
  csv: "text-emerald-400",
  markdown: "text-purple-400",
  html: "text-orange-400",
  jsonld: "text-indigo-400",
};

export function OutputArtifactCard({ artifact, downloadable, runId }: OutputArtifactCardProps) {
  const color = FORMAT_COLORS[artifact.format] ?? "text-slate-400";
  const isPrivate = artifact.privacy_level === "restricted";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3">
      <FileText size={16} className={clsx("flex-shrink-0", color)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300">{artifact.filename}</span>
          {isPrivate && <Shield size={11} className="text-amber-400 flex-shrink-0" />}
          <span className="ml-auto text-[10px] font-medium uppercase text-slate-600">
            .{artifact.format}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 truncate">{artifact.description}</p>
      </div>
      {downloadable && runId && (
        <a
          href={`/v1/wizard/runs/${runId}/artifacts/${artifact.filename}`}
          download={artifact.filename}
          className="flex-shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-700 hover:text-slate-300 transition-all"
        >
          <Download size={13} />
        </a>
      )}
    </div>
  );
}
