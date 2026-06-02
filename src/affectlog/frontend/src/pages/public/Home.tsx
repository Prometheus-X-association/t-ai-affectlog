import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, ExternalLink, Github,
  Server, Cloud, Database, ShieldCheck, BarChart2,
  Cpu, FileText, Share2, Code2, Lock, Layers,
  Terminal, Package, FlaskConical, Eye, Network,
  ClipboardList, Globe,
} from "lucide-react";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicFooter } from "../../components/public/PublicFooter";
import { DatasetToModelPipeline } from "../../components/visuals/DatasetToModelPipeline";
import { XapiEventStream } from "../../components/visuals/XapiEventStream";
import { DataSpaceConstellation } from "../../components/visuals/DataSpaceConstellation";
import { ConnectorInteroperabilityMap } from "../../components/visuals/ConnectorInteroperabilityMap";
import { FairnessMetricRadar } from "../../components/visuals/FairnessMetricRadar";
import { AuditArtifactStack } from "../../components/visuals/AuditArtifactStack";

// ── Motion helpers ─────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
};

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.5, delay, ease: [0, 0, 0.2, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  "Open-source Core",
  "Managed by AffectLog",
  "OpenAPI-first",
  "xAPI-ready",
  "JSON-LD Exports",
  "Privacy-by-default",
  "Prometheus-X BB04",
];

function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 100% 80% at 50% -10%, #0f1f3d 0%, #030712 70%)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Glow accent */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <FadeUp delay={0.05}>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Prometheus-X Building Block BB04 · EDGE-Skills
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-6 tracking-tight">
                Trustworthy AI assessment{" "}
                <span style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  for education and skills data spaces
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.18}>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
                Inspect datasets, evaluate model behaviour, detect privacy and representation
                risks, and generate audit-ready evidence through open, privacy-preserving workflows.
              </p>
            </FadeUp>

            <FadeUp delay={0.24}>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 transition-all"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", boxShadow: "0 0 24px rgba(34,211,238,0.25)" }}
                >
                  Launch Console <ArrowRight size={16} />
                </Link>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-2 font-semibold text-slate-200 rounded-xl px-6 py-3 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
                >
                  <Server size={16} className="text-slate-400" />
                  Self-host Community Edition
                </Link>
                <Link
                  to="/cloud"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 px-3 py-3 transition-colors"
                >
                  Explore Managed Cloud <ArrowRight size={14} />
                </Link>
              </div>
            </FadeUp>

            {/* Trust badges */}
            <FadeUp delay={0.3}>
              <div className="flex flex-wrap gap-2">
                {TRUST_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]"
                  >
                    <CheckCircle2 size={10} className="text-cyan-400 opacity-70" />
                    {badge}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right — pipeline visual */}
          <FadeUp delay={0.3} className="hidden lg:block">
            <div
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Assessment Pipeline</span>
                <span className="badge-cyan">live demo</span>
              </div>
              <DatasetToModelPipeline />
              <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-3">
                {[
                  { v: "1M+", l: "rows processed" },
                  { v: "GDPR", l: "PII scan" },
                  { v: "JSON-LD", l: "artifacts" },
                ].map((m) => (
                  <div key={m.l} className="text-center">
                    <div className="text-sm font-bold text-cyan-400">{m.v}</div>
                    <div className="text-xs text-slate-600">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── EDITION SPLIT ─────────────────────────────────────────────────────────
function EditionSplit() {
  return (
    <section className="py-24 px-6" style={{ background: "#050c1a" }}>
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One platform, two ways to run</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The managed edition is built on the same open-source core, with AffectLog-operated infrastructure, support, and optional enterprise services.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Community */}
          <FadeUp delay={0.1}>
            <div
              className="rounded-2xl p-8 h-full flex flex-col border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(34,211,238,0.2)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)" }}>
                  <Server size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Community Edition</h3>
                  <span className="text-xs text-cyan-400">Open Source · MIT License</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {[
                  "Self-hosted, local or on-premise",
                  "Full dataset audit workflows",
                  "Docker Compose deployment",
                  "PostgreSQL + Redis",
                  "Developer recipes & model adapters",
                  "OpenAPI-first backend",
                  "RBAC + admin-approved registration",
                  "No AffectLog Cloud required",
                  "Synthetic sample datasets",
                  "Community support via GitHub",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/community"
                className="inline-flex items-center justify-center gap-2 font-semibold text-white rounded-xl px-6 py-3 border border-cyan-400/30 hover:bg-cyan-400/[0.08] transition-all"
              >
                Deploy Community Edition <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>

          {/* Managed */}
          <FadeUp delay={0.18}>
            <div
              className="rounded-2xl p-8 h-full flex flex-col border relative overflow-hidden"
              style={{ background: "rgba(167,139,250,0.04)", borderColor: "rgba(167,139,250,0.25)" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.12)" }}>
                  <Cloud size={18} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Managed Edition</h3>
                  <span className="text-xs text-violet-400">Hosted & operated by AffectLog</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8 relative">
                {[
                  "Hosted and operated by AffectLog",
                  "Multi-tenant workspace provisioning",
                  "Admin-approved organization onboarding",
                  "Managed backups and monitoring",
                  "Platform-level RBAC and audit logs",
                  "Managed email and notifications",
                  "Usage metering and quotas",
                  "Support and upgrade path",
                  "Optional private tenant deployment",
                  "Optional bring-your-own-cloud",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/request-access"
                className="inline-flex items-center justify-center gap-2 font-semibold text-white rounded-xl px-6 py-3 transition-all relative"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 24px rgba(167,139,250,0.2)" }}
              >
                Request Managed Access <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── CAPABILITY GRID ────────────────────────────────────────────────────────
const CAPS = [
  { icon: Database,     title: "Dataset Structure",         desc: "Ingest CSV, JSON, Parquet. Validate schema. Detect field types and completeness.",     color: "#22d3ee" },
  { icon: ShieldCheck,  title: "PII & Quasi-Identifiers",   desc: "GDPR-aware scanning. Regex and NLP-based detection. Automatic pseudonymisation.",     color: "#34d399" },
  { icon: BarChart2,    title: "Fairness Metrics",          desc: "Gini coefficient, Coverage@K, dominance ratio, representation index, entropy.",        color: "#a78bfa" },
  { icon: FlaskConical, title: "xAPI Event Semantics",      desc: "Verb and activity-type normalization. Becomino template inference. Long-tail analysis.", color: "#22d3ee" },
  { icon: Eye,          title: "Sparsity & Missingness",    desc: "Field-level sparsity heatmap. Temporal density and event gap analysis.",               color: "#38bdf8" },
  { icon: Cpu,          title: "Model Explainability",      desc: "Feature importance, prediction explanations, model card generation, comparison.",       color: "#a78bfa" },
  { icon: Lock,         title: "Privacy-by-default",        desc: "No raw dataset stored. Metadata-only outputs. Pseudonymised field inventory.",         color: "#34d399" },
  { icon: FileText,     title: "Audit Artifacts",           desc: "SOP report, Data Card, JSON-LD compliance graph, dashboard export payload.",           color: "#22d3ee" },
  { icon: Share2,       title: "Connector-ready",           desc: "OpenAPI service. PDC, CARiSMA, LOLA interoperability. Data-space protocol ready.",     color: "#38bdf8" },
  { icon: Layers,       title: "Assessment Recipes",        desc: "YAML-defined reusable pipeline specs. Inokufu, Maskott, generic templates.",           color: "#a78bfa" },
  { icon: Network,      title: "Concentration Analysis",    desc: "Long-tail activity patterns. Temporal concentration. Dominance curves.",               color: "#22d3ee" },
  { icon: ClipboardList,title: "Compliance Metadata",       desc: "AI Act Annex IV fields, GDPR Article 30, JSON-LD structured evidence graph.",         color: "#34d399" },
];

function CapabilityGrid() {
  return (
    <section className="py-24 px-6" style={{ background: "#030712" }}>
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What AffectLog assesses</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A complete assessment pipeline — from raw trace ingestion to audit-ready compliance evidence.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CAPS.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <FadeUp key={cap.title} delay={i * 0.04}>
                <div
                  className="rounded-xl p-5 h-full group transition-all duration-200 border"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${cap.color}30`;
                    (e.currentTarget as HTMLElement).style.background = `${cap.color}06`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${cap.color}15` }}
                  >
                    <Icon size={16} style={{ color: cap.color }} />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm mb-1.5">{cap.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{cap.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── WORKFLOW ───────────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  { step: "Upload or connect dataset", detail: "CSV, JSON, Parquet via API or file upload. No raw data retained beyond the session." },
  { step: "Validate schema",          detail: "Field detection, type inference, mandatory-field audit. Becomino template matching." },
  { step: "Scan identifiers",         detail: "GDPR field mapping, regex PII patterns, quasi-identifier flagging." },
  { step: "Normalize to xAPI",        detail: "Verb canonicalization, activity type mapping, actor pseudonymisation." },
  { step: "Profile quality",          detail: "Sparsity, missingness, temporal density, long-tail and concentration analysis." },
  { step: "Compute metrics",          detail: "Gini, Coverage@K, dominance ratio, entropy, representation index." },
  { step: "Attach model (optional)",  detail: "Connect via model adapter. Feature importance, SHAP values, model comparison." },
  { step: "Generate audit artifacts", detail: "SOP report, Data Card, Model Card, field inventory, JSON-LD graph." },
  { step: "Export metadata only",     detail: "Privacy-preserving dashboard payload. No raw records in any export." },
];

const STEP_COLORS = ["#22d3ee", "#38bdf8", "#34d399", "#a78bfa", "#22d3ee", "#38bdf8", "#a78bfa", "#34d399", "#22d3ee"];

function WorkflowSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#050c1a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                From raw trace to audit evidence
              </h2>
              <p className="text-slate-400 mb-10">
                A repeatable, privacy-preserving assessment pipeline from raw data to shareable structured evidence.
              </p>
            </FadeUp>

            <div className="space-y-0">
              {WORKFLOW_STEPS.map((s, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-4 group pb-1">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${STEP_COLORS[i]}15`, border: `1px solid ${STEP_COLORS[i]}40`, color: STEP_COLORS[i] }}
                      >
                        {i + 1}
                      </div>
                      {i < WORKFLOW_STEPS.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ background: `${STEP_COLORS[i]}20`, minHeight: "24px" }} />
                      )}
                    </div>
                    <div className="pt-0.5 pb-4">
                      <p className="font-medium text-slate-200 text-sm">{s.step}</p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Right — xAPI stream visual */}
          <FadeUp delay={0.2} className="lg:sticky lg:top-24">
            <div
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">xAPI Event Stream</span>
              </div>
              <XapiEventStream />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── DATA SPACES ───────────────────────────────────────────────────────────
function DataSpacesSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#030712" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Data Space Interoperability</span>
              </div>
              <DataSpaceConstellation />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for data spaces</h2>
            <div className="space-y-5">
              {[
                { icon: Globe,       title: "OpenAPI-first service",       desc: "All workflows exposed via OpenAPI 3.1. Machine-readable contracts. Versionable endpoints.", color: "#22d3ee" },
                { icon: Share2,      title: "Connector-ready architecture", desc: "PDC-aware consent flow placeholders. CARiSMA and LOLA metadata bridges. External model registry support.", color: "#a78bfa" },
                { icon: Lock,        title: "Metadata-only outputs",        desc: "Privacy-preserving by design. No raw dataset bytes in any export or API response.", color: "#34d399" },
                { icon: Code2,       title: "JSON-LD and interoperable cards", desc: "Machine-readable compliance evidence. Dataset cards, model cards, processing activity records.", color: "#38bdf8" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                      <Icon size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── COMMUNITY SECTION ─────────────────────────────────────────────────────
function CommunitySection() {
  return (
    <section className="py-24 px-6" style={{ background: "#050c1a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "rgba(34,211,238,0.12)" }}>
                <Github size={14} className="text-cyan-400" />
              </div>
              <span className="text-sm font-medium text-cyan-400">Open-source Community Edition</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Deploy locally. Run independently. Contribute openly.
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Community Edition is designed for local execution where datasets remain under the control
              of the deploying institution. Universities, public-sector bodies, research labs, EdTechs,
              and auditors can run the full assessment workflow without any dependency on AffectLog Cloud.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Raw datasets are never included in the public repository. Synthetic examples and schemas
              are provided for testing and contribution.
            </p>

            <div
              className="rounded-xl p-4 mb-8 font-mono text-sm"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {[
                { c: "#64748b", t: "# Clone and run locally" },
                { c: "#22d3ee", t: "git clone https://github.com/Prometheus-X-association/t-ai-affectlog" },
                { c: "#34d399", t: "docker compose up" },
                { c: "#a78bfa", t: "make seed && make create-admin" },
                { c: "#22d3ee", t: "make synthetic-1m  # generate 1M-row test dataset" },
                { c: "#64748b", t: "# http://localhost:3000" },
              ].map(({ c, t }, i) => (
                <div key={i} className="py-0.5" style={{ color: c }}>{t}</div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Prometheus-X-association/t-ai-affectlog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] transition-all"
              >
                <Github size={15} /> View GitHub
              </a>
              <Link
                to="/community"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white px-5 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all"
              >
                Community Edition guide <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fairness & Representation Metrics</span>
              </div>
              <FairnessMetricRadar />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── MANAGED SECTION ────────────────────────────────────────────────────────
function ManagedSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#030712" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp className="lg:order-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "rgba(167,139,250,0.12)" }}>
                <Cloud size={14} className="text-violet-400" />
              </div>
              <span className="text-sm font-medium text-violet-400">Managed Edition · AffectLog Cloud</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              All the workflows. None of the infrastructure.
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Managed Edition provides an AffectLog-operated environment for organizations that want the
              same assessment workflows without managing infrastructure. Built on the same open-source core.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                ["Multi-tenant workspaces",  "#a78bfa"],
                ["Admin-approved onboarding","#34d399"],
                ["Managed backups",          "#22d3ee"],
                ["Platform monitoring",      "#38bdf8"],
                ["Support & SLA",            "#a78bfa"],
                ["Managed email / SMTP",     "#34d399"],
                ["Audit trail",              "#22d3ee"],
                ["Usage metering",           "#38bdf8"],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-sm text-slate-300">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/request-access"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 24px rgba(167,139,250,0.2)" }}
              >
                Request Access <ArrowRight size={15} />
              </Link>
              <Link
                to="/cloud"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white px-5 py-3 rounded-xl hover:bg-white/[0.04] transition-all"
              >
                Managed Cloud overview <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="lg:order-1">
            <div
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Audit Artifact Stack</span>
              </div>
              <AuditArtifactStack />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── ECOSYSTEM ─────────────────────────────────────────────────────────────
const ECOSYSTEM_TOOLS = [
  {
    name: "CARiSMA",
    affil: "EDGE-Skills Ecosystem",
    role: "Design-time AI risk & compliance",
    phase: "Design-time",
    color: "#38bdf8",
    desc: "Model-level security, risk, and compliance analysis at design time. Annotates model artefacts with compliance markers before deployment.",
  },
  {
    name: "LOLA",
    affil: "EDGE-Skills Ecosystem",
    role: "Scenario-based evaluation",
    phase: "Evaluation scenario",
    color: "#a78bfa",
    desc: "Algorithm evaluation using educational scenario datasets. Bridges the gap between design constraints and operational evidence.",
  },
  {
    name: "AffectLog",
    affil: "This platform",
    role: "Operation-time dataset & model assessment",
    phase: "Operation-time",
    color: "#22d3ee",
    highlight: true,
    desc: "Dataset profiling, model explainability, fairness metrics, privacy scanning, and audit-ready evidence generation at operation time.",
  },
];

function EcosystemSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#050c1a" }}>
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prometheus-X Trustworthy AI Ecosystem</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              AffectLog operates at the operation-time layer, complementing CARiSMA and LOLA across the AI system lifecycle.
            </p>
          </div>
        </FadeUp>

        {/* Lifecycle line */}
        <FadeUp delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-10">
            {ECOSYSTEM_TOOLS.map((t, i) => (
              <React.Fragment key={t.name}>
                <div
                  className="text-xs font-medium px-3 py-1 rounded-full border"
                  style={{ color: t.color, borderColor: `${t.color}40`, background: `${t.color}10` }}
                >
                  {t.phase}
                </div>
                {i < ECOSYSTEM_TOOLS.length - 1 && (
                  <ArrowRight size={14} className="text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {ECOSYSTEM_TOOLS.map((tool, i) => (
            <FadeUp key={tool.name} delay={i * 0.1}>
              <div
                className="rounded-2xl p-6 h-full border"
                style={{
                  background: tool.highlight ? `${tool.color}06` : "rgba(255,255,255,0.025)",
                  borderColor: tool.highlight ? `${tool.color}30` : "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{tool.name}</h3>
                    <p className="text-xs text-slate-500">{tool.affil}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ color: tool.color, borderColor: `${tool.color}40`, background: `${tool.color}10` }}
                  >
                    {tool.highlight ? "this platform" : tool.phase}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-3" style={{ color: tool.color }}>{tool.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3}>
          <div className="text-center mt-10">
            <a
              href="https://prometheus-x-association.github.io/docs/t-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Technical BB04 documentation <ExternalLink size={13} />
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── DEVELOPER CTA ─────────────────────────────────────────────────────────
const DEV_CONTRIB = [
  { icon: Package,      label: "Add a dataset recipe",    desc: "YAML-defined assessment pipeline for a new dataset format." },
  { icon: Cpu,          label: "Add a model adapter",     desc: "Plug in a new ML framework or model API." },
  { icon: BarChart2,    label: "Contribute a metric",     desc: "Implement a fairness, quality, or explainability metric." },
  { icon: Share2,       label: "Add a connector bridge",  desc: "Integrate with a PDC, CARiSMA, or LOLA endpoint." },
  { icon: Eye,          label: "Improve visualizations",  desc: "Add chart types or improve existing metric displays." },
  { icon: FileText,     label: "Add synthetic fixtures",  desc: "Provide test datasets for CI and community onboarding." },
  { icon: ShieldCheck,  label: "Review security",         desc: "Audit code paths, dependencies, or policy enforcement." },
  { icon: Code2,        label: "Validate OpenAPI",        desc: "Verify endpoint contracts and schema correctness." },
];

function DeveloperSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#030712" }}>
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Contribute reusable assessment infrastructure
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              AffectLog is built to be extended. Every recipe, adapter, metric, and connector makes
              the platform stronger for universities, auditors, and AI providers across the ecosystem.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {DEV_CONTRIB.map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeUp key={c.label} delay={i * 0.04}>
                <a
                  href="https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl p-4 border border-white/[0.06] hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] transition-all group"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <Icon size={16} className="text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                  <p className="text-sm font-medium text-slate-300 mb-1">{c.label}</p>
                  <p className="text-xs text-slate-600">{c.desc}</p>
                </a>
              </FadeUp>
            );
          })}
        </div>

        <FadeUp delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/Prometheus-X-association/t-ai-affectlog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-white px-6 py-3 rounded-xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] transition-all"
            >
              <Github size={16} /> View on GitHub
            </a>
            <Link
              to="/developers"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-xl hover:bg-white/[0.04] transition-all"
            >
              Developer Hub <ArrowRight size={14} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, #0f1f3d 0%, #030712 60%)" }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Run a privacy-preserving assessment today
          </h2>
          <p className="text-slate-400 mb-10">
            Self-host the open-source core or use the AffectLog-managed edition for hosted operations,
            onboarding, monitoring, backups, and support.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/community"
              className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all"
            >
              <Server size={16} /> Start self-hosted
            </Link>
            <Link
              to="/request-access"
              className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 transition-all"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", boxShadow: "0 0 24px rgba(34,211,238,0.2)" }}
            >
              Request managed access <ArrowRight size={16} />
            </Link>
            <a
              href="https://github.com/Prometheus-X-association/t-ai-affectlog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-5 py-3 rounded-xl hover:bg-white/[0.04] transition-all"
            >
              <Github size={15} /> Contribute on GitHub
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── PAGE ASSEMBLY ──────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        <Hero />
        <EditionSplit />
        <CapabilityGrid />
        <WorkflowSection />
        <DataSpacesSection />
        <CommunitySection />
        <ManagedSection />
        <EcosystemSection />
        <DeveloperSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </div>
  );
}
