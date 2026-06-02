import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Cloud, Server } from "lucide-react";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicFooter } from "../../components/public/PublicFooter";

const SECTORS = [
  "Higher Education", "Secondary Education", "Vocational Training",
  "Public Sector / Government", "Research Institution", "Non-profit",
  "EdTech / Learning Platform", "AI Provider", "Data Provider", "Auditor / Consultancy", "Other",
];

const DEPLOYMENT_OPTIONS = [
  { id: "managed_cloud",   label: "Managed Cloud",            desc: "AffectLog operates the environment for you." },
  { id: "private_tenant",  label: "Private Tenant",           desc: "Dedicated environment, custom residency options." },
  { id: "byoc",            label: "Bring Your Own Cloud",     desc: "Deploy to your cloud, AffectLog supports." },
  { id: "on_prem_support", label: "On-Premise with Support",  desc: "Institutional deployment with AffectLog guidance." },
];

type FormState = {
  name: string;
  email: string;
  organization: string;
  country: string;
  sector: string;
  intended_use: string;
  expected_volume: string;
  deployment_pref: string;
  compliance_needs: string;
  message: string;
  consent: boolean;
};

const INITIAL: FormState = {
  name: "", email: "", organization: "", country: "", sector: "",
  intended_use: "", expected_volume: "", deployment_pref: "managed_cloud",
  compliance_needs: "", message: "", consent: false,
};

export default function RequestAccess() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/public/request-managed-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#030712", color: "#f1f5f9", minHeight: "100vh" }}>
      <PublicHeader />
      <main>
        <section
          className="py-20 px-6 relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, #1a0a2e 0%, #030712 60%)" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left panel */}
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-violet-400 border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1.5 rounded-full mb-6">
                  <Cloud size={12} />
                  AffectLog Managed Edition
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Request managed access
                </h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Tell us about your organization and intended use. Our team will review your request and
                  contact you within 2 business days to discuss requirements.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: CheckCircle2, color: "#34d399", text: "No commitment required to request access" },
                    { icon: CheckCircle2, color: "#34d399", text: "We review each request individually" },
                    { icon: CheckCircle2, color: "#34d399", text: "Community Edition available immediately on GitHub" },
                  ].map(({ icon: Icon, color, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <Icon size={15} style={{ color }} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{text}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-8 rounded-xl p-5 border"
                  style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Server size={14} className="text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-400">Prefer self-hosting?</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Community Edition is available immediately on GitHub. No approval required.
                  </p>
                  <a
                    href="https://github.com/Prometheus-X-association/t-ai-affectlog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                  >
                    View Community Edition <ArrowRight size={11} />
                  </a>
                </div>
              </div>

              {/* Form panel */}
              <div
                className="rounded-2xl p-8 border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(52,211,153,0.12)" }}>
                      <CheckCircle2 size={26} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3">Request received</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Thank you. Our team will review your request and contact you at{" "}
                      <span className="text-slate-200">{form.email}</span> within 2 business days.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">Full name *</label>
                        <input required value={form.name} onChange={handle("name")} className="input w-full" placeholder="Jane Smith" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">Work email *</label>
                        <input required type="email" value={form.email} onChange={handle("email")} className="input w-full" placeholder="jane@university.edu" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">Organization *</label>
                        <input required value={form.organization} onChange={handle("organization")} className="input w-full" placeholder="University of…" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">Country *</label>
                        <input required value={form.country} onChange={handle("country")} className="input w-full" placeholder="France" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Sector *</label>
                      <select required value={form.sector} onChange={handle("sector")} className="select w-full">
                        <option value="">Select sector…</option>
                        {SECTORS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Intended use *</label>
                      <textarea
                        required
                        value={form.intended_use}
                        onChange={handle("intended_use")}
                        className="input w-full resize-none"
                        rows={3}
                        placeholder="Describe your intended use case…"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Expected data volume</label>
                      <input value={form.expected_volume} onChange={handle("expected_volume")} className="input w-full" placeholder="e.g. 500k rows per assessment run" />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Deployment preference *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {DEPLOYMENT_OPTIONS.map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all"
                            style={{
                              borderColor: form.deployment_pref === opt.id ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.07)",
                              background: form.deployment_pref === opt.id ? "rgba(167,139,250,0.06)" : "rgba(255,255,255,0.02)",
                            }}
                          >
                            <input
                              type="radio"
                              name="deployment_pref"
                              value={opt.id}
                              checked={form.deployment_pref === opt.id}
                              onChange={handle("deployment_pref")}
                              className="mt-0.5 accent-violet-500"
                            />
                            <div>
                              <p className="text-xs font-medium text-slate-200">{opt.label}</p>
                              <p className="text-xs text-slate-600">{opt.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Security / compliance requirements</label>
                      <input value={form.compliance_needs} onChange={handle("compliance_needs")} className="input w-full" placeholder="e.g. GDPR, data residency, SSO requirements" />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Additional message</label>
                      <textarea value={form.message} onChange={handle("message")} className="input w-full resize-none" rows={2} placeholder="Anything else we should know?" />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={form.consent}
                        onChange={handle("consent")}
                        className="mt-0.5 accent-violet-500"
                      />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        I agree that AffectLog may use the information above to contact me about this access request.
                        No commitment is made by submitting this form.
                      </span>
                    </label>

                    {error && (
                      <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 font-semibold text-white rounded-xl py-3 transition-all disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 20px rgba(167,139,250,0.2)" }}
                    >
                      {submitting ? "Submitting…" : <>Submit request <ArrowRight size={16} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
