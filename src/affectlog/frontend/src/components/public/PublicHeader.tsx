import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github } from "lucide-react";
import { cn } from "../../design-system/cn";

const NAV_ITEMS = [
  { label: "Community",  to: "/community" },
  { label: "Cloud",      to: "/cloud" },
  { label: "Pricing",    to: "/pricing" },
  { label: "Developers", to: "/developers" },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-navy-900/95 backdrop-blur-xl border-b border-white/[0.06] shadow-card"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/img/affectlog360_logo_dark.svg"
              alt="AffectLog"
              className="h-7 object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "text-cyan-400 bg-cyan-400/[0.08]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <a
              href="https://github.com/roy-saurabh/edge_affectlog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Github size={15} />
              <span className="hidden xl:inline">GitHub</span>
            </a>
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/request-access"
              className="btn-cyan text-sm px-4 py-2"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)" }}
            >
              Request Access
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 right-0 z-50 lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="mx-4 rounded-2xl border border-white/[0.08] shadow-card-lg overflow-hidden"
                style={{ background: "#050c1a" }}
              >
                <nav className="p-4 space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] flex flex-col gap-2">
                  <Link to="/login" className="btn-outline-dim w-full justify-center py-2.5 text-sm">
                    Sign in
                  </Link>
                  <Link
                    to="/request-access"
                    className="btn-cyan w-full justify-center py-2.5 text-sm"
                    style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)" }}
                  >
                    Request Access
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content clears the fixed header */}
      <div className="h-16" />
    </>
  );
}
