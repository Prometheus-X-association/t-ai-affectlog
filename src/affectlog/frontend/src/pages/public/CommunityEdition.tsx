import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Github, Server, ArrowRight, CheckCircle2, Terminal,
  Package, Cpu, Shield, FileText, BarChart2,
  Code2, Share2, ExternalLink, Users, Lock,
} from "lucide-react";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicFooter } from "../../components/public/PublicFooter";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45 },
};

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.45, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const CONTRIB_TYPES = [
  { icon: Package,    label: "Assessment Recipes",   desc: "YAML-defined pipeline specifications for new dataset formats and providers." },
  { icon: Cpu,        label: "Model Adapters",        desc: "Plug in scikit-learn, PyTorch, Keras, or custom prediction APIs." },
  { icon: BarChart2,  label: "Metrics",              desc: "Fairness, quality, explainability, and privacy metric implementations." },
  { icon: Share2,     label: "Connector Bridges",    desc: "PDC, CARiSMA, LOLA, and external registry integrations." },
  { icon: FileText,   label: "Synthetic Fixtures",   desc: "Test datasets for CI and community onboarding." },
  { icon: Code2,      label: "OpenAPI Contracts",    desc: "Validate and extend the API specification." },
  { icon: Shield,     label: "Security Reviews",     desc: "Audit code paths, dependencies, and policy enforcement." },
  { icon: Users,      label: "Documentation",        desc: "Improve guides, translations, and example notebooks." },
];

const FEATURES = [
  "Complete dataset audit workflow",
  "xAPI event normalization and profiling",
  "GDPR-aware PII scanning",
  "Gini, Coverage@K, dominance, entropy metrics",
  "Model adapter architecture",
  "Feature importance and model comparison",
  "SOP report and JSON-LD compliance graph",
  "OpenAPI-first FastAPI backend",
  "RBAC with admin-approved registration",
  "Docker Compose deployment",
  "PostgreSQL + Redis",
  "Celery async job processing",
  "Synthetic sample datasets",
  "Developer recipes and YAML configs",
  "GitHub Actions CI",
  "Local artifact storage (S3-compatible optional)",
];

export default function CommunityEdition() {
  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        {/* Hero */}
        <section
          className="py-24 px-6 relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #0a1f30 0%, #030712 60%)" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-100"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <div className="inline-flex items-center gap-2 text-xs text-cyan-400 border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 rounded-full mb-6">
                <Server size={12} />
                Self-hosted · Open Source · MIT License
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                AffectLog Community Edition
              </h1>
              <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                The complete Trustworthy AI assessment platform for local and on-premise deployment.
              </p>
              <p className="text-slate-500 mb-10 max-w-xl mx-auto">
                Designed for universities, public-sector institutions, research labs, EdTechs, data providers,
                and auditors who need local execution where datasets remain under institutional control.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/self-host"
                  className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 transition-all"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", boxShadow: "0 0 24px rgba(34,211,238,0.2)" }}
                >
                  Deploy Community Edition <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/Prometheus-X-association/t-ai-affectlog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-slate-200 rounded-xl px-6 py-3 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] transition-all"
                >
                  <Github size={16} /> View on GitHub
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">What's included</h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FEATURES.map((f, i) => (
                <FadeUp key={f} delay={i * 0.03}>
                  <div className="flex items-start gap-2 p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                    <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Quick start */}
        <section className="py-20 px-6" style={{ background: "#030712" }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Quick start</h2>
              <p className="text-slate-400 text-center mb-10">Docker Compose up in minutes. No cloud account required.</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div
                className="rounded-2xl p-6 mb-8 font-mono text-sm leading-relaxed"
                style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="text-slate-600 mb-3"># 1. Clone the repository</div>
                <div className="text-cyan-400 mb-2">git clone https://github.com/Prometheus-X-association/t-ai-affectlog</div>
                <div className="text-cyan-400 mb-4">cd t-ai-affectlog</div>
                <div className="text-slate-600 mb-3"># 2. Configure environment</div>
                <div className="text-slate-300 mb-4">cp .env.example .env  <span className="text-slate-600"># edit SMTP, secret key</span></div>
                <div className="text-slate-600 mb-3"># 3. Start all services</div>
                <div className="text-emerald-400 mb-2">docker compose up</div>
                <div className="text-slate-600 mb-3"># 4. Initialise</div>
                <div className="text-violet-400 mb-2">make seed && make create-admin</div>
                <div className="text-slate-600 mb-3"># 5. Generate synthetic test dataset (optional)</div>
                <div className="text-amber-400 mb-4">make synthetic-1m</div>
                <div className="text-slate-600"># → http://localhost:3000</div>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/self-host" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  Full self-host guide <ArrowRight size={13} />
                </Link>
                <span className="text-slate-700">·</span>
                <a href="/api/docs" className="text-sm text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1">
                  API reference <ExternalLink size={11} />
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Contribution */}
        <section className="py-20 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Contribute to the platform</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  Every contribution — recipe, metric, adapter, or fixture — improves the platform for the entire
                  open-source and data-space community.
                </p>
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {CONTRIB_TYPES.map((c, i) => {
                const Icon = c.icon;
                return (
                  <FadeUp key={c.label} delay={i * 0.04}>
                    <a
                      href="https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl p-4 border border-white/[0.06] hover:border-cyan-400/20 hover:bg-cyan-400/[0.03] transition-all"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <Icon size={16} className="text-slate-500 mb-2" />
                      <p className="text-sm font-medium text-slate-300 mb-1">{c.label}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
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
                  <Github size={16} /> Open GitHub
                </a>
                <a
                  href="https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  Read contributor guide <ArrowRight size={14} />
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* License notice */}
        <section className="py-12 px-6" style={{ background: "#030712", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div
                className="rounded-xl p-6 border"
                style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(34,211,238,0.15)" }}
              >
                <div className="flex items-start gap-3">
                  <Lock size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200 mb-2">Community Edition is MIT Licensed</p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      The Community Edition source code in the public repository is released under the MIT License.
                      Managed Edition services may include proprietary operational components not included in this
                      repository. The core remains fully usable without AffectLog Cloud.
                    </p>
                    <p className="text-xs text-slate-600 mt-3">
                      Raw partner datasets are never committed. Synthetic examples and schemas are provided for testing and contribution.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
