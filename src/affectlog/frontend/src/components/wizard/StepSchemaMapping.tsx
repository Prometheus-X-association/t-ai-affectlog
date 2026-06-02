import React from "react";
import { Tag, Info } from "lucide-react";
import type { InspectInputResponse } from "../../api/wizard";
import { FieldMappingTable } from "./FieldMappingTable";

interface StepSchemaMappingProps {
  inspection: InspectInputResponse | null;
  mappings: Record<string, string>;
  onMapField: (role: string, fieldName: string) => void;
}

export function StepSchemaMapping({ inspection, mappings, onMapField }: StepSchemaMappingProps) {
  const fields = inspection?.field_inventory ?? [];
  const isPreMapped = inspection?.detected_format === "maskott_csv_v1";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Schema Mapping</h2>
        <p className="mt-1 text-xs text-slate-500">
          Confirm how dataset fields map to AffectLog concepts. Incorrect mappings silently
          invalidate downstream metrics.
        </p>
      </div>

      {isPreMapped && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Maskott CSV detected — all standard fields have been pre-mapped automatically.
            Review and adjust below if needed.
          </p>
        </div>
      )}

      {fields.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-8 text-center">
          <Tag size={20} className="mx-auto mb-2 text-slate-600" />
          <p className="text-sm text-slate-500">No fields detected. Complete Step 2 first.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">Detected fields ({fields.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <span
                  key={f.name}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                    f.pii_flag
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-slate-700/50 bg-slate-800/50 text-slate-400"
                  }`}
                >
                  {f.pii_flag && "⚠ "}
                  {f.name}
                  <span className="text-slate-600">({f.inferred_type})</span>
                </span>
              ))}
            </div>
          </div>

          <FieldMappingTable fields={fields} mappings={mappings} onMapField={onMapField} />

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-medium text-amber-300 mb-1.5">Guardrails</p>
            <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
              <li>Fairness-by-group requires a group field — it cannot be inferred.</li>
              <li>Classification metrics require both target and prediction fields.</li>
              <li>Temporal analyses require a timestamp field.</li>
              <li>Entity identifier fields will be HMAC-pseudonymised by default.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
