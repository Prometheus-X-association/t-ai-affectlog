import React from "react";
import { Tag } from "lucide-react";
import type { FieldInventoryEntry } from "../../api/wizard";

interface FieldMappingTableProps {
  fields: FieldInventoryEntry[];
  mappings: Record<string, string>;
  onMapField: (role: string, fieldName: string) => void;
}

const ROLES = [
  { id: "entity_field", label: "Entity / User", description: "Unique learner or actor identifier" },
  { id: "item_field", label: "Item / Resource", description: "Content or resource identifier" },
  { id: "timestamp_field", label: "Timestamp", description: "Event date or time" },
  { id: "session_field", label: "Session", description: "Session or attempt identifier" },
  { id: "verb_field", label: "Verb / ViewContext", description: "Action type or event verb" },
  { id: "target_field", label: "Target (Ground Truth)", description: "Label or outcome field for ML" },
  { id: "prediction_field", label: "Prediction", description: "Model prediction output field" },
  { id: "group_field", label: "Group / Segment", description: "Fairness or cohort grouping" },
];

export function FieldMappingTable({ fields, mappings, onMapField }: FieldMappingTableProps) {
  const fieldOptions = ["— not mapped —", ...fields.map((f) => f.name)];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50 bg-slate-800/50">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400">Role</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400">Description</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400">Mapped field</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {ROLES.map((role) => (
            <tr key={role.id} className="hover:bg-slate-800/20 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Tag size={12} className="text-indigo-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-300">{role.label}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{role.description}</td>
              <td className="px-4 py-3">
                <select
                  value={mappings[role.id] ?? ""}
                  onChange={(e) => onMapField(role.id, e.target.value)}
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                >
                  {fieldOptions.map((opt) => (
                    <option key={opt} value={opt === "— not mapped —" ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
