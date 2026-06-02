import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cloud, ArrowRight, CheckCircle2, Shield, BarChart2,
  Users, Globe, Lock, Database, Cpu, Mail, Activity,
  Building2, Key,
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

const MANAGED_FEATURES = [
  { icon: Cloud,      title: "Hosted Infrastructure",      desc: "AffectLog operates all servers, databases, and workers. No infrastructure to manage.", color: "#a78bfa" },
  { icon: Users,      title: "Multi-tenant Workspaces",    desc: "Isolated workspace provisioning per organization. Role-based access within each tenant.", color: "#22d3ee" },
  { icon: Shield,     title: "Admin-approved Onboarding",  desc: "Organization registration reviewed by AffectLog before activation. Domain allowlists.", color: "#34d399" },
  { icon: Activity,   title: "Platform Monitoring",        desc: "Uptime, job metrics, usage metering, and structured audit logs.", color: "#38bdf8" },
  { icon: Database,   title: "Managed Backups",            desc: "Automatic backup with configurable retention policies per tenant.", color: "#a78bfa" },
  { icon: Mail,       title: "Managed Email",              desc: "Transactional email for invitations, approvals, and notifications. No SMTP setup required.", color: "#22d3ee" },
  { icon: Key,        title: "Support Access Protocol",    desc: "Time-limited, audit-logged support access. Tenant owner approval required.", color: "#34d399" },
  { icon: Building2,  title: "Private Tenant Option",      desc: "Dedicated environment with custom data residency and advanced governance on request.", color: "#38bdf8" },
];

const SUPPORT_ACCESS = [
  "Tenant owner grants access — not AffectLog",
  "Time-limited with explicit expiry",
  "Reason and scope required",
  "All actions audited in tenant log",
  "Raw dataset access disabled by default",
  "Break-glass documented, not enabled by default",
];

export default function ManagedCloud() {
  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        {/* Hero */}
        <section
          className="py-24 px-6 relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #1a0a2e 0%, #030712 60%)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)" }} />

          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <div className="inline-flex items-center gap-2 text-xs text-violet-400 border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1.5 rounded-full mb-6">
                <Cloud size={12} />
                Hosted &amp; operated by AffectLog
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                AffectLog Managed Edition
              </h1>
              <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                The same open-source assessment workflows, without the infrastructure.
              </p>
              <p className="text-slate-500 mb-10 max-w-xl mx-auto">
                AffectLog operates the hosted environment including multi-tenant provisioning, monitoring,
                backups, support, and managed email — so your team can focus on assessments.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/request-access"
                  className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 transition-all"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 24px rgba(167,139,250,0.25)" }}
                >
                  Request Access <ArrowRight size={16} />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 text-slate-200 rounded-xl px-6 py-3 border border-white/10 hover:border-violet-400/30 hover:bg-violet-400/[0.04] transition-all"
                >
                  View pricing <ArrowRight size={15} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-20 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">What AffectLog manages for you</h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MANAGED_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <FadeUp key={f.title} delay={i * 0.04}>
                    <div
                      className="rounded-xl p-5 h-full border"
                      style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${f.color}15` }}>
                        <Icon size={16} style={{ color: f.color }} />
                      </div>
                      <h3 className="font-semibold text-slate-200 text-sm mb-1.5">{f.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support access model */}
        <section className="py-20 px-6" style={{ background: "#030712" }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <FadeUp>
                <h2 className="text-2xl font-bold text-white mb-4">Support access model</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  AffectLog support staff do not have permanent blanket access to tenant environments.
                  Access is time-limited, tenant-owner-approved, and fully audited.
                </p>
                <ul className="space-y-3">
                  {SUPPORT_ACCESS.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h2 className="text-2xl font-bold text-white mb-4">Admin hierarchy</h2>
                <div className="space-y-2">
                  {[
                    { role: "Platform Super Admin", scope: "Full platform" },
                    { role: "Platform Operator",    scope: "Tenant management" },
                    { role: "Support Engineer",     scope: "Time-limited, tenant-approved" },
                    { role: "Tenant Owner",         scope: "Their workspace" },
                    { role: "Tenant Admin",         scope: "Workspace users and settings" },
                    { role: "Tenant Auditor",       scope: "Read-only audit access" },
                    { role: "Tenant Researcher",    scope: "Dataset and assessment runs" },
                    { role: "Tenant Viewer",        scope: "Results only" },
                  ].map((r) => (
                    <div key={r.role} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-sm text-slate-300">{r.role}</span>
                      <span className="text-xs text-slate-600">{r.scope}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Open-source core note */}
        <section className="py-12 px-6" style={{ background: "#050c1a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div
                className="rounded-xl p-6 border"
                style={{ background: "rgba(167,139,250,0.04)", borderColor: "rgba(167,139,250,0.2)" }}
              >
                <p className="text-sm font-semibold text-slate-200 mb-2">Built on the open-source core</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Managed Edition is built on the same open-source codebase as Community Edition. The open-source
                  assessment workflows, APIs, and data models are identical. Managed Edition adds hosted
                  infrastructure, multi-tenant operations, support, and optional enterprise services.
                </p>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View Community Edition <ArrowRight size={13} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center" style={{ background: "#030712" }}>
          <div className="max-w-2xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-slate-400 mb-8">
                Request managed access and our team will review your organization's requirements.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/request-access"
                  className="inline-flex items-center gap-2 font-semibold text-white rounded-xl px-6 py-3 transition-all"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 24px rgba(167,139,250,0.2)" }}
                >
                  Request access <ArrowRight size={16} />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  View pricing <ArrowRight size={14} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
