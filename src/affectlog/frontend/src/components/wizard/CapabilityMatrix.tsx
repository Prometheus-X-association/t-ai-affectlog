import React from "react";
import { Check, Minus, HelpCircle, X } from "lucide-react";
import clsx from "clsx";

type CellState = "supported" | "supported_with_mapping" | "requires_additional_input" | "not_applicable" | "unsupported";

interface MatrixCell {
  state: CellState;
  note?: string;
}

interface CapabilityMatrixProps {
  matrix: Record<string, Record<string, MatrixCell>>;
  rows: string[];
  columns: string[];
  highlightRow?: string;
}

function CellIcon({ state }: { state: CellState }) {
  switch (state) {
    case "supported":
      return <Check size={11} className="text-emerald-400" />;
    case "supported_with_mapping":
      return <Check size={11} className="text-amber-400" />;
    case "requires_additional_input":
      return <HelpCircle size={11} className="text-blue-400" />;
    case "not_applicable":
      return <Minus size={11} className="text-slate-600" />;
    case "unsupported":
      return <X size={11} className="text-red-500" />;
  }
}

const COLUMN_LABELS: Record<string, string> = {
  schema_validation: "Schema",
  pii_scan: "PII",
  pseudonymisation: "Pseudo",
  xapi_normalization: "xAPI",
  statistical_profiling: "Stats",
  temporal_profiling: "Temporal",
  concentration_metrics: "Conc.",
  representation_metrics: "Repr.",
  recommender_metrics: "Rec.",
  classification_metrics: "Class.",
  regression_metrics: "Regr.",
  model_explanations: "Explain",
  model_comparison: "Compare",
  compliance_graph: "JSON-LD",
  sop_export: "SOP",
  data_card: "Data Card",
  model_card: "Model Card",
};

const ROW_LABELS: Record<string, string> = {
  maskott_csv_v1: "Maskott CSV",
  becomino_json: "Becomino JSON",
  generic_xapi_json: "xAPI JSON",
  generic_xapi_jsonl: "xAPI JSONL",
  generic_csv_tabular: "Generic CSV",
  parquet_tabular: "Parquet",
  dataset_plus_predictions: "+ Predictions",
  dataset_plus_model: "+ Model",
  dataset_plus_two_models: "+ 2 Models",
  recommendation_outputs: "Rec. Outputs",
  unsupported_unstructured: "Unstructured",
};

export function CapabilityMatrix({ matrix, rows, columns, highlightRow }: CapabilityMatrixProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="w-full min-w-[700px] text-xs">
        <thead>
          <tr className="border-b border-slate-700/50 bg-slate-800/60">
            <th className="sticky left-0 z-10 bg-slate-800/60 px-3 py-2.5 text-left text-[10px] font-medium text-slate-400 whitespace-nowrap">
              Input Type
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="px-2 py-2.5 text-center text-[10px] font-medium text-slate-400 whitespace-nowrap"
                title={col.replace(/_/g, " ")}
              >
                {COLUMN_LABELS[col] ?? col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {rows.map((row) => {
            const isHighlighted = row === highlightRow;
            const rowData = matrix[row] ?? {};
            return (
              <tr
                key={row}
                className={clsx(
                  "transition-colors",
                  isHighlighted ? "bg-indigo-500/10" : "hover:bg-slate-800/20",
                )}
              >
                <td
                  className={clsx(
                    "sticky left-0 z-10 px-3 py-2 whitespace-nowrap font-medium",
                    isHighlighted ? "bg-indigo-500/10 text-indigo-300" : "bg-slate-900/80 text-slate-400",
                  )}
                >
                  {ROW_LABELS[row] ?? row}
                </td>
                {columns.map((col) => {
                  const cell: MatrixCell = rowData[col] ?? { state: "not_applicable" };
                  return (
                    <td key={col} className="px-2 py-2 text-center" title={cell.note}>
                      <div className="flex justify-center">
                        <CellIcon state={cell.state} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-4 px-4 py-3 border-t border-slate-700/30 bg-slate-800/20">
        {[
          { state: "supported" as CellState, label: "Supported" },
          { state: "supported_with_mapping" as CellState, label: "With mapping" },
          { state: "requires_additional_input" as CellState, label: "Needs more input" },
          { state: "not_applicable" as CellState, label: "N/A" },
          { state: "unsupported" as CellState, label: "Unsupported" },
        ].map(({ state, label }) => (
          <div key={state} className="flex items-center gap-1.5">
            <CellIcon state={state} />
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
