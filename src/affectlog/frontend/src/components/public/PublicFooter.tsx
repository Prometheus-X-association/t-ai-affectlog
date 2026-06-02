import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github } from "lucide-react";

const COLS = [
  {
    title: "Community Edition",
    links: [
      { label: "Overview",          to: "/community" },
      { label: "Self-host Guide",   to: "/self-host" },
      { label: "Docker Compose",    to: "/self-host#docker" },
      { label: "Contributor Guide", href: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md" },
      { label: "GitHub",            href: "https://github.com/Prometheus-X-association/t-ai-affectlog" },
    ],
  },
  {
    title: "Managed Cloud",
    links: [
      { label: "Overview",              to: "/cloud" },
      { label: "Pricing",               to: "/pricing" },
      { label: "Request Access",        to: "/request-access" },
      { label: "Managed Ops Guide",     to: "/docs#managed" },
      { label: "Status Page",           href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Developer Hub",         to: "/developers" },
      { label: "API Reference",         href: "/api/docs" },
      { label: "OpenAPI Spec",          href: "/api/openapi.json" },
      { label: "Add a Recipe",          href: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CONTRIBUTING.md" },
      { label: "Model Adapters",        to: "/docs#adapters" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Prometheus-X BB04",     href: "https://prometheus-x.org/bb04-trustworthy-ai-assessment/" },
      { label: "BB04 Technical Docs",   href: "https://prometheus-x-association.github.io/docs/t-ai/" },
      { label: "EDGE-Skills Project",   href: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/883807838/project/101123471/program/43152860/details" },
      { label: "CARiSMA",               href: "#" },
      { label: "LOLA",                  href: "#" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Product Overview",      to: "/docs" },
      { label: "SaaS Architecture",     to: "/docs#saas" },
      { label: "Security Model",        to: "/security" },
      { label: "Privacy Policy",        to: "/docs#privacy" },
      { label: "Data Governance",       to: "/docs#governance" },
    ],
  },
  {
    title: "Legal & Security",
    links: [
      { label: "License (MIT)",         href: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/LICENSE" },
      { label: "Security Policy",       href: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/SECURITY.md" },
      { label: "Edition Boundaries",    to: "/docs#editions" },
      { label: "CITATION.cff",          href: "https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/CITATION.cff" },
      { label: "Responsible Disclosure",to: "/security" },
    ],
  },
];

function FooterLink({ link }: { link: { label: string; to?: string; href?: string } }) {
  const cls = "text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1";
  if (link.to) return <Link to={link.to} className={cls}>{link.label}</Link>;
  const isExternal = link.href && !link.href.startsWith("/");
  return (
    <a
      href={link.href ?? "#"}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {link.label}
      {isExternal && <ExternalLink size={10} className="opacity-40" />}
    </a>
  );
}

export function PublicFooter() {
  return (
    <footer style={{ background: "#030712", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand + description */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-12">
          <div className="flex-shrink-0 max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #22d3ee, #0ea5e9)" }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="white" opacity="0.9" />
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" strokeOpacity="0.4" />
                </svg>
              </div>
              <span className="font-bold text-white text-sm">AffectLog</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Open-source and managed Trustworthy AI assessment for education and skills data spaces.
            </p>
            <a
              href="https://github.com/Prometheus-X-association/t-ai-affectlog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Github size={14} /> GitHub
            </a>
          </div>

          {/* EU funding acknowledgement */}
          <div className="sm:ml-auto max-w-sm">
            <p className="text-xs text-slate-600 leading-relaxed">
              This project has received funding from the Digital Europe Programme under the EDGE-Skills project
              (grant agreement 101123471). Views expressed are those of the authors and do not necessarily reflect
              those of the European Commission.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a
                href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/883807838/project/101123471/program/43152860/details"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
              >
                EDGE-Skills <ExternalLink size={9} />
              </a>
              <span className="text-slate-700">·</span>
              <a
                href="https://prometheus-x.org/bb04-trustworthy-ai-assessment/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
              >
                Prometheus-X BB04 <ExternalLink size={9} />
              </a>
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="accent-line-cyan mb-12" />

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p>
            AffectLog Community Edition is released under the{" "}
            <a
              href="https://github.com/Prometheus-X-association/t-ai-affectlog/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 underline"
            >
              MIT License
            </a>
            .{" "}
            Managed Edition services may include proprietary operational components not included in this repository.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-slate-700">Raw datasets are never committed. Synthetic samples provided.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
