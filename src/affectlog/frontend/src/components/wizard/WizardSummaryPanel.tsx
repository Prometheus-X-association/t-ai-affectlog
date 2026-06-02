import React from "react";
import { type LucideIcon, Database, Cpu, Crosshair, BarChart2, Package } from "lucide-react";
import type { WizardPlan } from "../../api/wizard";

interface WizardSummaryPanelProps {
  plan: Partial<WizardPlan>;
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={13} className="text-indigo-400 flex-shrink-0" />
      <span className="text-xs text-slate-500">{label}</span>
      <span className="ml-auto text-xs font-medium text-slate-300">{value}</span>
    </div>
  );
}

export function WizardSummaryPanel({ plan }: WizardSummaryPanelProps) {
  const hasModel = Object.keys(plan.model_context ?? {}).length > 0;

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan Summary</p>
      <div className="space-y-2">
        <SummaryRow
          icon={Database}
          label="Format"
          value={plan.detected_format?.replace(/_/g, " ")}
        />
        <SummaryRow
          icon={Cpu}
          label="Model"
          value={hasModel ? "Registered" : undefined}
        />
        <SummaryRow
          icon={Crosshair}
          label="Analyses"
          value={plan.selected_analyses?.length}
        />
        <SummaryRow
          icon={BarChart2}
          label="Plots"
          value={plan.selected_plots?.length}
        />
        <SummaryRow
          icon={Package}
          label="Exports"
          value={plan.selected_exports?.length}
        />
      </div>
      {plan.purpose && (
        <div className="rounded-lg bg-slate-700/30 px-3 py-2">
          <p className="text-[10px] text-slate-500">Purpose</p>
          <p className="text-xs text-slate-300 capitalize mt-0.5">
            {plan.purpose.replace(/_/g, " ")}
          </p>
        </div>
      )}
    </div>
  );
}
