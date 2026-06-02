import React from "react";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import clsx from "clsx";
import type { ValidationIssue } from "../../api/wizard";

interface GuardrailAlertProps {
  issue: ValidationIssue;
}

export function GuardrailAlert({ issue }: GuardrailAlertProps) {
  const isBlock = issue.severity === "block";
  const isWarn = issue.severity === "warn";

  return (
    <div
      className={clsx(
        "flex gap-3 rounded-xl border p-4",
        isBlock && "border-red-500/30 bg-red-500/10",
        isWarn && "border-amber-500/30 bg-amber-500/10",
        !isBlock && !isWarn && "border-blue-500/30 bg-blue-500/10",
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {isBlock && <XCircle size={16} className="text-red-400" />}
        {isWarn && <AlertTriangle size={16} className="text-amber-400" />}
        {!isBlock && !isWarn && <Info size={16} className="text-blue-400" />}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p
          className={clsx(
            "text-sm font-medium",
            isBlock && "text-red-300",
            isWarn && "text-amber-300",
            !isBlock && !isWarn && "text-blue-300",
          )}
        >
          {issue.title}
        </p>
        <p className="text-xs text-slate-400">{issue.message}</p>
        <p className="text-xs text-slate-500">
          <span className="font-medium text-slate-400">Fix: </span>
          {issue.remediation}
        </p>
        {issue.affected_step && (
          <p className="text-xs text-slate-600">Affects Step {issue.affected_step}</p>
        )}
      </div>
    </div>
  );
}
