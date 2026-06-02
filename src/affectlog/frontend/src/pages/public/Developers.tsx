import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Github, ArrowRight, Code2, Package, Cpu, BarChart2,
  Share2, FileText, Shield, Eye, ExternalLink, Terminal,
} from "lucide-react";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicFooter } from "../../components/public/PublicFooter";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div {...fadeUp} transition={{ duration: 0.45, delay }} className={className}>{children}</motion.div>;
}

const CONTRIB_AREAS = [
  {
    icon: Package,
    title: "Assessment Recipes",
    color: "#22d3ee",
    desc: "YAML-defined pipeline specifications. Define field mappings, verb normalization rules, PII patterns, and metric parameters for a new dataset format.",
    path: "configs/recipes/",
    guide: "CONTRIBUTING.md#recipes",
  },
  {
    icon: Cpu,
    title: "Model Adapters",
    color: "#a78bfa",
    desc: "Plug in scikit-learn, PyTorch, Keras, HuggingFace, or custom model APIs. Adapters expose predictions, feature importance, and SHAP values.",
    path: "src/affectlog/models/",
    guide: "docs/model-adapters.md",
  },
  {
    icon: BarChart2,
    title: "Fairness & Quality Metrics",
    color: "#34d399",
    desc: "Implement Gini, Coverage@K, entropy, dominance, representation index, or custom metrics. Metric results feed audit artifact generation.",
    path: "src/affectlog/metrics/",
    guide: "CONTRIBUTING.md#metrics",
  },
  {
    icon: Share2,
    title: "Connector Bridges",
    color: "#38bdf8",
    desc: "Integrate with PDC, CARiSMA, LOLA, external model registries, or data-space APIs. Connectors are modular and feature-gated.",
    path: "src/affectlog/interoperability/",
    guide: "docs/architecture.md#connectors",
  },
  {
    icon: Eye,
    title: "Visualizations",
    color: "#a78bfa",
    desc: "Add chart types, improve Gini/Coverage displays, contribute diagnostic plots, or enhance the audit pipeline visualization.",
    path: "src/affectlog/frontend/src/components/",
    guide: "CONTRIBUTING.md#frontend",
  },
  {
    icon: FileText,
    title: "Synthetic Fixtures",
    color: "#22d3ee",
    desc: "Provide anonymized or fully synthetic test datasets for CI pipelines and community onboarding. No raw partner data committed.",
    path: "data/samples/",
    guide: "CONTRIBUTING.md#fixtures",
  },
  {
    icon: Shield,
    title: "Security Reviews",
    color: "#34d399",
    desc: "Audit API endpoints, authentication flows, RBAC enforcement, dependency vulnerabilities, and OpenAPI contract correctness.",
    path: "SECURITY.md",
    guide: "SECURITY.md",
  },
  {
    icon: Code2,
    title: "OpenAPI Contracts",
    color: "#38bdf8",
    desc: "Validate endpoint schemas, request/response models, and authentication flows. Run schema validation in CI.",
    path: "docs/openapi.yaml",
    guide: "scripts/validate_openapi.sh",
  },
];

const QUICK_COMMANDS = [
  { cmd: "git clone https://github.com/Prometheus-X-association/t-ai-affectlog", color: "#22d3ee", comment: "Clone" },
  { cmd: "docker compose up",                                                      color: "#34d399", comment: "Start all services" },
  { cmd: "make seed && make create-admin",                                          color: "#a78bfa", comment: "Initialise" },
  { cmd: "make test",                                                              color: "#38bdf8", comment: "Run test suite" },
  { cmd: "make synthetic-1m",                                                       color: "#fbbf24", comment: "Generate 1M-row test dataset" },
  { cmd: "make lint && make typecheck",                                             color: "#94a3b8", comment: "Quality checks" },
  { cmd: "make benchmark",                                                          color: "#22d3ee", comment: "Performance benchmark" },
];

const API_REFS = [
  { label: "OpenAPI docs (Swagger UI)",   href: "/api/docs" },
  { label: "OpenAPI JSON spec",           href: "/api/openapi.json" },
  { label: "ReDoc reference",             href: "/api/redoc" },
  { label: "BB04 Technical Docs",         href: "https://prometheus-x-association.github.io/docs/t-ai/", external: true },
];

export default function Developers() {
  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        {/* Hero */}
        <section
          className="py-20 px-6 relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, #0a1628 0%, #030712 60%)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <div className="inline-flex items-center gap-2 text-xs text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 rounded-full mb-6">
                <Code2 size={12} />
                Open-source · Developer Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Contribute reusable assessment infrastructure
              </h1>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                AffectLog is built to be extended. Every recipe, adapter, metric, and connector improves
                the platform for universities, auditors, and AI providers across the data-space ecosystem.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/Prometheus-X-association/t-ai-affectlog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] transition-all"
                >
                  <Github size={16} /> View on GitHub
                </a>
                <a
                  href="https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-300 rounded-xl px-6 py-3 hover:bg-white/[0.04] transition-all"
                >
                  Contributor Guide <ArrowRight size={15} />
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Quick start */}
        <section className="py-16 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="flex items-center gap-2 mb-6">
                <Terminal size={16} className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Quick start</h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <div
                className="rounded-2xl p-6 font-mono text-sm leading-relaxed"
                style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {QUICK_COMMANDS.map(({ cmd, color, comment }, i) => (
                  <div key={i} className="py-0.5 flex items-start gap-3">
                    <span className="text-slate-600 select-none">$</span>
                    <span style={{ color }}>{cmd}</span>
                    <span className="text-slate-700 ml-auto text-xs hidden sm:block"># {comment}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Contribution areas */}
        <section className="py-16 px-6" style={{ background: "#030712" }}>
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl font-bold text-white mb-10 text-center">Ways to contribute</h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONTRIB_AREAS.map((area, i) => {
                const Icon = area.icon;
                return (
                  <FadeUp key={area.title} delay={i * 0.04}>
                    <a
                      href={`https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/${area.guide}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl p-5 h-full border border-white/[0.06] hover:border-cyan-400/20 hover:bg-cyan-400/[0.03] transition-all group"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${area.color}15` }}>
                        <Icon size={16} style={{ color: area.color }} />
                      </div>
                      <h3 className="font-semibold text-slate-200 text-sm mb-1.5">{area.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-3">{area.desc}</p>
                      <code className="text-xs text-slate-700 font-mono">{area.path}</code>
                    </a>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* API reference */}
        <section className="py-16 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl font-bold text-white mb-6">API reference</h2>
            </FadeUp>
            <FadeUp delay={0.08}>
              <div className="grid sm:grid-cols-2 gap-4">
                {API_REFS.map((ref) => (
                  <a
                    key={ref.label}
                    href={ref.href}
                    target={ref.external ? "_blank" : undefined}
                    rel={ref.external ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/25 hover:bg-cyan-400/[0.03] transition-all"
                    style={{ background: "rgba(255,255,255,0.025)" }}
                  >
                    <span className="text-sm text-slate-300">{ref.label}</span>
                    <ExternalLink size={13} className="text-slate-600" />
                  </a>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
