import React from "react";
import { Users, BookOpen, Activity, TrendingUp, Layers, Clock } from "lucide-react";
import { DashboardPayload } from "../api";

interface CardProps {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
  sub?: string;
  accent?: string;
}

function StatCard({ icon: Icon, label, value, sub, accent = "text-indigo-400" }: CardProps) {
  return (
    <div className="card-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="stat-label">{label}</span>
        <Icon size={14} className="text-slate-600" />
      </div>
      <div className={`text-2xl font-bold ${accent} leading-none`}>
        {value != null ? String(value) : "—"}
      </div>
      {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
    </div>
  );
}

export default function MetricsCards({ payload }: { payload: DashboardPayload }) {
  const {
    total_events, unique_actors, unique_resources,
    actor_gini, resource_gini, avg_duration_seconds,
    unique_resource_types,
  } = payload as DashboardPayload & { avg_duration_seconds?: number; unique_resource_types?: number };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        icon={Activity}
        label="Total Events"
        value={total_events?.toLocaleString()}
        accent="text-white"
      />
      <StatCard
        icon={Users}
        label="Unique Actors"
        value={unique_actors?.toLocaleString()}
        accent="text-sky-400"
      />
      <StatCard
        icon={BookOpen}
        label="Unique Resources"
        value={unique_resources?.toLocaleString()}
        accent="text-violet-400"
      />
      <StatCard
        icon={TrendingUp}
        label="Actor Gini"
        value={actor_gini?.toFixed(3)}
        sub="0=equal, 1=concentrated"
        accent={actor_gini != null && actor_gini >= 0.7 ? "text-red-400" : actor_gini != null && actor_gini >= 0.5 ? "text-amber-400" : "text-emerald-400"}
      />
      <StatCard
        icon={Layers}
        label="Resource Gini"
        value={resource_gini?.toFixed(3)}
        sub="0=equal, 1=concentrated"
        accent={resource_gini != null && resource_gini >= 0.7 ? "text-red-400" : resource_gini != null && resource_gini >= 0.5 ? "text-amber-400" : "text-emerald-400"}
      />
      <StatCard
        icon={Clock}
        label="Avg Duration"
        value={avg_duration_seconds != null ? `${avg_duration_seconds.toFixed(0)}s` : unique_resource_types?.toLocaleString()}
        sub={avg_duration_seconds != null ? "per session" : "resource types"}
        accent="text-indigo-400"
      />
    </div>
  );
}
