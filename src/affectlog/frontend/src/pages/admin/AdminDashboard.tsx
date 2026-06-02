import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/admin";
import { Link } from "react-router-dom";
import { Users, ClipboardList, Shield, Activity } from "lucide-react";

interface SystemHealth {
  status: string;
  version: string;
  users: number;
  pending_registrations: number;
}

export default function AdminDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    adminApi.getSystemHealth().then(setHealth).catch(() => {});
  }, []);

  const cards = [
    {
      label: "Pending Registrations",
      value: health?.pending_registrations ?? "—",
      href: "/admin/pending-registrations",
      icon: ClipboardList,
      color: health?.pending_registrations ? "text-amber-400" : "text-slate-400",
    },
    { label: "Total Users", value: health?.users ?? "—", href: "/admin/users", icon: Users, color: "text-indigo-400" },
    { label: "Audit Log", value: "View", href: "/admin/audit-log", icon: Shield, color: "text-slate-400" },
    { label: "System Health", value: health?.status ?? "—", href: "/admin/system", icon: Activity, color: health?.status === "ok" ? "text-emerald-400" : "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">AffectLog v{health?.version ?? "…"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, href, icon: Icon, color }) => (
          <Link key={label} to={href}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-indigo-600/40 transition-all">
            <Icon size={20} className={`${color} mb-3`} />
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-sm text-slate-400">
        <p className="font-medium text-slate-300 mb-2">Quick actions</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/pending-registrations" className="text-indigo-400 hover:text-indigo-300 transition-colors">Review registrations →</Link>
          <Link to="/admin/users" className="text-indigo-400 hover:text-indigo-300 transition-colors">Manage users →</Link>
          <Link to="/admin/audit-log" className="text-indigo-400 hover:text-indigo-300 transition-colors">Security log →</Link>
          <Link to="/admin/email" className="text-indigo-400 hover:text-indigo-300 transition-colors">Email settings →</Link>
        </div>
      </div>
    </div>
  );
}
