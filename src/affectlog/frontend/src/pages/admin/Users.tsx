import React, { useEffect, useState } from "react";
import { adminApi, AdminUser } from "../../api/admin";
import { UserX, Mail } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); adminApi.getUsers().then(setUsers).finally(() => setLoading(false)); };
  useEffect(load, []);

  const disable = async (id: string) => {
    if (!confirm("Disable this user?")) return;
    await adminApi.disableUser(id);
    load();
  };

  const resend = async (id: string) => {
    await adminApi.resendActivation(id);
    alert("Activation email resent (or logged in dev mode).");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Users</h1>
        <p className="text-slate-400 text-sm mt-0.5">{users.length} total accounts</p>
      </div>

      {loading ? <p className="text-slate-500 text-sm">Loading…</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-700">
                <th className="pb-2 pr-4">Name / Email</th>
                <th className="pb-2 pr-4">Org</th>
                <th className="pb-2 pr-4">Roles</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-2.5 pr-4">
                    <p className="text-slate-200 font-medium">{u.full_name}</p>
                    <p className="text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{u.organization ?? "—"}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span key={r} className="bg-indigo-900/40 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded-full text-xs">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? "bg-emerald-900/40 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex gap-2">
                      {!u.is_active && (
                        <button onClick={() => resend(u.id)} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                          <Mail size={12} /> Resend
                        </button>
                      )}
                      {u.is_active && !u.is_superadmin && (
                        <button onClick={() => disable(u.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                          <UserX size={12} /> Disable
                        </button>
                      )}
                    </div>
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
