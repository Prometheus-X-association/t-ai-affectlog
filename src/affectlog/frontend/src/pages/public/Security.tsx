import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2, ArrowRight, ExternalLink, Eye, Key, AlertTriangle } from "lucide-react";
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

const PRINCIPLES = [
  {
    icon: Lock,
    title: "Privacy-by-default",
    color: "#34d399",
    points: [
      "No raw dataset bytes stored beyond processing session",
      "All outputs are metadata-only",
      "PII scanning and pseudonymisation built into the pipeline",
      "Actor fields hashed before any metric computation",
    ],
  },
  {
    icon: Shield,
    title: "Auth & access control",
    color: "#22d3ee",
    points: [
      "JWT authentication with configurable expiry",
      "Multi-factor authentication (TOTP) available",
      "Admin-approved registration — no open self-signup by default",
      "Role-based permission system (RBAC) enforced at route and service layers",
      "Account lockout after failed login attempts",
    ],
  },
  {
    icon: Eye,
    title: "Audit and traceability",
    color: "#a78bfa",
    points: [
      "All admin and auth events written to immutable audit log",
      "Job start/stop/error events recorded",
      "Artifact access logged",
      "Support access (managed edition) time-limited and fully audited",
    ],
  },
  {
    icon: Key,
    title: "Tenant isolation (managed edition)",
    color: "#38bdf8",
    points: [
      "All data scoped by tenant_id at database level",
      "Cross-tenant access denied even by URL manipulation",
      "Support staff require tenant owner approval for time-limited access",
      "Raw dataset access disabled for support staff by default",
    ],
  },
];

export default function Security() {
  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        <section className="py-20 px-6 text-center" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -10%, #0a1628 0%, #030712 60%)" }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400 border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 rounded-full mb-6">
                <Shield size={12} />
                Security &amp; Privacy Model
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Security model</h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                AffectLog is designed for handling sensitive educational trace data. Privacy and security
                are built into the core pipeline, not bolted on afterwards.
              </p>
            </FadeUp>
          </div>
        </section>

        <section className="py-16 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {PRINCIPLES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <FadeUp key={p.title} delay={i * 0.08}>
                    <div
                      className="rounded-2xl p-6 h-full border"
                      style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${p.color}15` }}>
                          <Icon size={16} style={{ color: p.color }} />
                        </div>
                        <h3 className="font-bold text-white">{p.title}</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {p.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: p.color }} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* Disclosure */}
        <section className="py-16 px-6" style={{ background: "#030712" }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="flex items-start gap-4">
                <AlertTriangle size={20} className="text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Responsible disclosure</h2>
                  <p className="text-slate-400 mb-4 leading-relaxed">
                    If you discover a security vulnerability in AffectLog, please report it privately via GitHub's
                    security advisory system or the contact in SECURITY.md. Do not open a public issue for security
                    vulnerabilities. We aim to acknowledge reports within 48 hours.
                  </p>
                  <a
                    href="https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/SECURITY.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Read SECURITY.md <ExternalLink size={13} />
                  </a>
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
