import React from "react";
import { motion } from "framer-motion";

const CENTER = { x: 210, y: 140, label: "AffectLog", color: "#22d3ee" };

const PEERS = [
  { id: "pdc",      label: "PDC",              sub: "Consent & Policy",     x: 60,  y: 40,  color: "#a78bfa" },
  { id: "carisma",  label: "CARiSMA",          sub: "Risk & Compliance",    x: 360, y: 40,  color: "#38bdf8" },
  { id: "lola",     label: "LOLA",             sub: "Scenario Evaluation",  x: 360, y: 230, color: "#34d399" },
  { id: "registry", label: "Model Registry",   sub: "External adapters",    x: 60,  y: 230, color: "#fbbf24" },
  { id: "export",   label: "Dashboard Export", sub: "JSON-LD / Artifact",   x: 210, y: 270, color: "#94a3b8" },
];

const EDGE_LABELS = [
  { from: "pdc",      label: "consent query" },
  { from: "carisma",  label: "metadata bridge" },
  { from: "lola",     label: "assessment feed" },
  { from: "registry", label: "adapter pull" },
  { from: "export",   label: "artifact push" },
];

export function ConnectorInteroperabilityMap() {
  return (
    <div className="relative w-full select-none" style={{ height: "300px" }}>
      <svg viewBox="0 0 420 300" className="w-full h-full">
        <defs>
          <radialGradient id="cim-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          {PEERS.map((p) => (
            <radialGradient key={p.id} id={`cim-${p.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={p.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Connection lines */}
        {PEERS.map((p, i) => (
          <g key={p.id}>
            <motion.line
              x1={CENTER.x} y1={CENTER.y}
              x2={p.x} y2={p.y}
              stroke={p.color}
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
              animate={{ strokeOpacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
            />
            {/* Traveling dot */}
            <motion.circle
              r={2.5}
              fill={p.color}
              animate={{
                cx: [CENTER.x, p.x],
                cy: [CENTER.y, p.y],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: "linear" }}
            />
          </g>
        ))}

        {/* Center node */}
        <circle cx={CENTER.x} cy={CENTER.y} r={38} fill="url(#cim-center)" />
        <motion.circle
          cx={CENTER.x} cy={CENTER.y} r={30}
          fill="rgba(34,211,238,0.1)"
          stroke="#22d3ee"
          strokeWidth="1.5"
          animate={{ r: [28, 34], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        <circle cx={CENTER.x} cy={CENTER.y} r={28} fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
        <text x={CENTER.x} y={CENTER.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#22d3ee" fontSize="8" fontWeight="700" fontFamily="var(--font-sans, sans-serif)">AffectLog</text>
        <text x={CENTER.x} y={CENTER.y + 13} textAnchor="middle" fill="#64748b" fontSize="5.5" fontFamily="var(--font-sans, sans-serif)">Assessment Core</text>

        {/* Peer nodes */}
        {PEERS.map((p, i) => (
          <motion.g
            key={p.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, type: "spring" }}
          >
            <circle cx={p.x} cy={p.y} r={24} fill={`url(#cim-${p.id})`} />
            <circle cx={p.x} cy={p.y} r={18} fill="rgba(255,255,255,0.04)" stroke={p.color} strokeWidth="1" strokeOpacity="0.6" />
            <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill={p.color} fontSize="6.5" fontWeight="600" fontFamily="var(--font-sans, sans-serif)">{p.label}</text>
            <text x={p.x} y={p.y + 26} textAnchor="middle" fill="#475569" fontSize="5.5" fontFamily="var(--font-sans, sans-serif)">{p.sub}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
