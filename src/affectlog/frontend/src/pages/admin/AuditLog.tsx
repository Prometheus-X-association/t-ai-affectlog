import React, { useEffect, useState } from "react";
import { adminApi, AuditLogEntry } from "../../api/admin";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLog(200).then(setEntries).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Security Audit Log</h1>
        <p className="text-slate-400 text-sm mt-0.5">Recent authentication and action events</p>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-700">
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 pr-4">Action</th>
                <th className="pb-2 pr-4">Actor</th>
                <th className="pb-2 pr-4">Resource</th>
                <th className="pb-2 pr-4">IP</th>
                <th className="pb-2">OK</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-2 pr-4 text-slate-500 whitespace-nowrap">
                    {new Date(e.logged_at).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 font-mono text-slate-300">{e.action}</td>
                  <td className="py-2 pr-4 text-slate-400">{e.actor_email ?? "system"}</td>
                  <td className="py-2 pr-4 text-slate-400">{[e.resource_type, e.detail].filter(Boolean).join(" — ")}</td>
                  <td className="py-2 pr-4 text-slate-500 font-mono">{e.ip_address ?? "—"}</td>
                  <td className="py-2">
                    {e.success
                      ? <CheckCircle2 size={13} className="text-emerald-400" />
                      : <XCircle size={13} className="text-red-400" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
