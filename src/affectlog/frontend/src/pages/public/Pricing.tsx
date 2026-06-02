import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ExternalLink, Server, Cloud, Building2, Globe } from "lucide-react";
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

const PLANS = [
  {
    icon: Server,
    title: "Community Edition",
    tagline: "Self-hosted, open source",
    price: "Free",
    priceNote: "MIT License",
    color: "#22d3ee",
    cta: { label: "Deploy Community Edition", to: "/community" },
    features: [
      "Full dataset audit workflow",
      "xAPI normalization & profiling",
      "PII scanning & pseudonymisation",
      "Fairness & representation metrics",
      "Model adapter architecture",
      "SOP + JSON-LD exports",
      "OpenAPI-first backend",
      "RBAC + admin onboarding",
      "Docker Compose deployment",
      "PostgreSQL + Redis",
      "Synthetic test datasets",
      "Community support (GitHub)",
    ],
  },
  {
    icon: Cloud,
    title: "Managed Cloud",
    tagline: "Hosted by AffectLog",
    price: "Contact",
    priceNote: "Pricing configured per organization",
    color: "#a78bfa",
    highlight: true,
    cta: { label: "Request Access", to: "/request-access" },
    features: [
      "Everything in Community Edition",
      "AffectLog-hosted infrastructure",
      "Multi-tenant workspace provisioning",
      "Admin-approved onboarding",
      "Managed backups and retention",
      "Platform monitoring and audit logs",
      "Managed email and notifications",
      "Usage metering and quotas",
      "Support and upgrade path",
      "SLA-ready operational tooling",
    ],
  },
  {
    icon: Building2,
    title: "Private Tenant",
    tagline: "Dedicated environment",
    price: "Contact",
    priceNote: "Pricing configured per deployment",
    color: "#34d399",
    cta: { label: "Request Access", to: "/request-access" },
    features: [
      "Everything in Managed Cloud",
      "Dedicated environment",
      "Custom data residency option",
      "Advanced governance controls",
      "Dedicated support tier",
      "Custom retention policies",
      "Domain-level isolation",
    ],
  },
  {
    icon: Globe,
    title: "BYOC / On-Prem Support",
    tagline: "Your infrastructure, our expertise",
    price: "Contact",
    priceNote: "Engagement-based",
    color: "#38bdf8",
    cta: { label: "Contact us", to: "/request-access" },
    features: [
      "Deployment support",
      "Security and hardening review",
      "Connector integration support",
      "Institution-specific recipes",
      "Custom model adapter development",
      "Onboarding and training",
    ],
  },
];

const COMPARE = [
  { feature: "Dataset audit workflow",        ce: true,  mc: true,  pt: true,  byoc: true  },
  { feature: "xAPI normalization",            ce: true,  mc: true,  pt: true,  byoc: true  },
  { feature: "PII scan + pseudonymisation",   ce: true,  mc: true,  pt: true,  byoc: true  },
  { feature: "Model adapter framework",       ce: true,  mc: true,  pt: true,  byoc: true  },
  { feature: "SOP + JSON-LD exports",         ce: true,  mc: true,  pt: true,  byoc: true  },
  { feature: "Self-hosted deployment",        ce: true,  mc: false, pt: false, byoc: true  },
  { feature: "AffectLog-hosted",             ce: false, mc: true,  pt: true,  byoc: false },
  { feature: "Multi-tenant workspaces",       ce: false, mc: true,  pt: true,  byoc: false },
  { feature: "Managed backups",               ce: false, mc: true,  pt: true,  byoc: false },
  { feature: "Platform monitoring",           ce: false, mc: true,  pt: true,  byoc: false },
  { feature: "Managed email",                 ce: false, mc: true,  pt: true,  byoc: false },
  { feature: "Dedicated environment",         ce: false, mc: false, pt: true,  byoc: false },
  { feature: "Custom data residency",         ce: false, mc: false, pt: true,  byoc: true  },
  { feature: "Deployment support",            ce: false, mc: false, pt: false, byoc: true  },
];

const Tick = ({ v }: { v: boolean }) =>
  v ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <span className="text-slate-700 mx-auto block text-center">—</span>;

export default function Pricing() {
  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        {/* Hero */}
        <section className="py-20 px-6 text-center" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -10%, #0f1f3d 0%, #030712 60%)" }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Transparent, flexible pricing</h1>
              <p className="text-slate-400 text-lg mb-4">
                Community Edition is free and open source. Managed services are configured per organization.
              </p>
              <p className="text-slate-500 text-sm">
                No payment implementation is required to get started. Request access and we'll discuss your needs.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Plan cards */}
        <section className="py-16 px-6" style={{ background: "#050c1a" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PLANS.map((plan, i) => {
                const Icon = plan.icon;
                return (
                  <FadeUp key={plan.title} delay={i * 0.08}>
                    <div
                      className="rounded-2xl p-6 h-full flex flex-col border"
                      style={{
                        background: plan.highlight ? `${plan.color}05` : "rgba(255,255,255,0.025)",
                        borderColor: plan.highlight ? `${plan.color}35` : "rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${plan.color}15` }}>
                          <Icon size={16} style={{ color: plan.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{plan.title}</h3>
                          <p className="text-xs" style={{ color: plan.color }}>{plan.tagline}</p>
                        </div>
                      </div>

                      <div className="mb-5">
                        <div className="text-2xl font-bold text-white">{plan.price}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{plan.priceNote}</div>
                      </div>

                      <ul className="space-y-2 flex-1 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={plan.cta.to}
                        className="inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-2.5 px-4 transition-all w-full"
                        style={
                          plan.highlight
                            ? { background: `linear-gradient(135deg, ${plan.color}cc, ${plan.color}aa)`, color: "#fff" }
                            : { border: `1px solid ${plan.color}30`, color: plan.color }
                        }
                      >
                        {plan.cta.label} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 px-6" style={{ background: "#030712" }}>
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Feature comparison</h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <th className="text-left px-5 py-4 text-slate-400 font-medium">Feature</th>
                      {["Community", "Managed Cloud", "Private Tenant", "BYOC / On-Prem"].map((h) => (
                        <th key={h} className="px-4 py-4 text-center text-slate-400 font-medium text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE.map((row, i) => (
                      <tr key={row.feature} style={{ borderBottom: i < COMPARE.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td className="px-5 py-3 text-slate-300 text-xs">{row.feature}</td>
                        <td className="px-4 py-3"><Tick v={row.ce} /></td>
                        <td className="px-4 py-3"><Tick v={row.mc} /></td>
                        <td className="px-4 py-3"><Tick v={row.pt} /></td>
                        <td className="px-4 py-3"><Tick v={row.byoc} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
