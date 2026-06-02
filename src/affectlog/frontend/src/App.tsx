import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Database, FlaskConical, ShieldCheck, Cpu,
  Users, ClipboardList, Shield, Mail, Activity, Settings,
  Menu, X, ExternalLink, LogOut, Wand2,
} from "lucide-react";
import clsx from "clsx";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { RequireAuth, RequireAdmin } from "./auth/RequireAuth";

// Public pages
const PublicHome = lazy(() => import("./pages/public/Home"));
const CommunityEdition = lazy(() => import("./pages/public/CommunityEdition"));
const ManagedCloud = lazy(() => import("./pages/public/ManagedCloud"));
const PricingPage = lazy(() => import("./pages/public/Pricing"));
const SelfHost = lazy(() => import("./pages/public/SelfHost"));
const DevelopersPage = lazy(() => import("./pages/public/Developers"));
const RequestAccess = lazy(() => import("./pages/public/RequestAccess"));
const SecurityPage = lazy(() => import("./pages/public/Security"));
const Login = lazy(() => import("./pages/public/Login"));
const Register = lazy(() => import("./pages/public/Register"));
const AwaitingApproval = lazy(() => import("./pages/public/AwaitingApproval"));
const Activation = lazy(() => import("./pages/public/Activation"));
const ForgotPassword = lazy(() => import("./pages/public/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/public/ResetPassword"));

// App pages (existing)
const AppHome = lazy(() => import("./pages/Home"));
const AnalysisWizard = lazy(() => import("./pages/app/AnalysisWizard"));
const Datasets = lazy(() => import("./pages/Datasets"));
const Audit = lazy(() => import("./pages/Audit"));
const Models = lazy(() => import("./pages/Models"));
const Compliance = lazy(() => import("./pages/Compliance"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const PendingRegistrations = lazy(() => import("./pages/admin/PendingRegistrations"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AuditLogPage = lazy(() => import("./pages/admin/AuditLog"));

const Spinner = () => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
    <div className="text-slate-500 text-sm">Loading…</div>
  </div>
);

// ── App layout sidebar nav ──────────────────────────────────────────────────
const APP_NAV = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/wizard", label: "Guided Assessment", icon: Wand2 },
  { to: "/app/datasets", label: "Datasets", icon: Database },
  { to: "/app/audit", label: "Audit", icon: FlaskConical },
  { to: "/app/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/app/models", label: "Models", icon: Cpu },
];

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/pending-registrations", label: "Registrations", icon: ClipboardList },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/audit-log", label: "Audit Log", icon: Shield },
  { to: "/admin/email", label: "Email", icon: Mail },
  { to: "/admin/system", label: "System", icon: Activity },
];

function AppSidebar({ nav, onClose, open }: { nav: typeof APP_NAV; onClose: () => void; open: boolean }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.is_superadmin || user?.roles.some((r) => ["Super Admin", "Admin"].includes(r));

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside className={clsx(
        "fixed top-0 left-0 h-full w-60 z-30 flex flex-col",
        "bg-slate-900 border-r border-slate-700/50",
        "transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700/50">
          <Link to="/" className="flex-1 min-w-0">
            <img src="/img/affectlog360_logo_dark.svg" alt="AffectLog" className="h-7 object-contain object-left" />
          </Link>
          <button className="flex-shrink-0 lg:hidden text-slate-500 hover:text-slate-300" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                isActive ? "bg-indigo-700/30 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800",
              )}
              onClick={onClose}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
          {isAdmin && (
            <NavLink to="/admin"
              className={({ isActive }) => clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                isActive ? "bg-indigo-700/30 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800",
              )}
            >
              <Settings size={16} /> Admin Panel
            </NavLink>
          )}
          <button onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div className="px-4 py-3 border-t border-slate-700/50 text-xs text-slate-600">
          <p className="truncate">{user?.full_name}</p>
          <p className="truncate text-slate-700">{user?.roles.join(", ")}</p>
        </div>
      </aside>
    </>
  );
}

function AppShell({ nav, children }: { nav: typeof APP_NAV; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AppSidebar nav={nav} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-700/50">
          <button onClick={() => setMenuOpen(true)} className="text-slate-400 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-white text-sm">AffectLog</span>
        </header>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Email/System admin stub pages ─────────────────────────────────────────
const AdminEmail = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-bold text-white">Email Settings</h1>
    <p className="text-slate-400 text-sm">Configure SMTP and test email templates via the API.</p>
    <a href="/api/docs#tag/admin" target="_blank" rel="noopener" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
      Open API docs <ExternalLink size={12} />
    </a>
  </div>
);
const AdminSystem = () => {
  const [health, setHealth] = React.useState<Record<string, unknown> | null>(null);
  React.useEffect(() => {
    import("./api/admin").then(({ adminApi }) => adminApi.getSystemHealth().then(setHealth).catch(() => {}));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">System Health</h1>
      {health ? (
        <pre className="bg-slate-800 text-slate-300 rounded-xl p-4 text-xs overflow-auto">
          {JSON.stringify(health, null, 2)}
        </pre>
      ) : <p className="text-slate-500 text-sm">Loading…</p>}
    </div>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/community" element={<CommunityEdition />} />
            <Route path="/cloud" element={<ManagedCloud />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/self-host" element={<SelfHost />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/awaiting-approval" element={<AwaitingApproval />} />
            <Route path="/activate" element={<Activation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Authenticated app routes */}
            <Route path="/app" element={<RequireAuth><AppShell nav={APP_NAV}><AppHome /></AppShell></RequireAuth>} />
            <Route path="/app/wizard/*" element={<RequireAuth><AppShell nav={APP_NAV}><AnalysisWizard /></AppShell></RequireAuth>} />
            <Route path="/app/datasets" element={<RequireAuth><AppShell nav={APP_NAV}><Datasets /></AppShell></RequireAuth>} />
            <Route path="/app/audit" element={<RequireAuth><AppShell nav={APP_NAV}><Audit /></AppShell></RequireAuth>} />
            <Route path="/app/compliance" element={<RequireAuth><AppShell nav={APP_NAV}><Compliance /></AppShell></RequireAuth>} />
            <Route path="/app/models" element={<RequireAuth><AppShell nav={APP_NAV}><Models /></AppShell></RequireAuth>} />

            {/* Admin routes */}
            <Route path="/admin" element={<RequireAdmin><AppShell nav={ADMIN_NAV}><AdminDashboard /></AppShell></RequireAdmin>} />
            <Route path="/admin/pending-registrations" element={<RequireAdmin><AppShell nav={ADMIN_NAV}><PendingRegistrations /></AppShell></RequireAdmin>} />
            <Route path="/admin/users" element={<RequireAdmin><AppShell nav={ADMIN_NAV}><AdminUsers /></AppShell></RequireAdmin>} />
            <Route path="/admin/audit-log" element={<RequireAdmin><AppShell nav={ADMIN_NAV}><AuditLogPage /></AppShell></RequireAdmin>} />
            <Route path="/admin/email" element={<RequireAdmin><AppShell nav={ADMIN_NAV}><AdminEmail /></AppShell></RequireAdmin>} />
            <Route path="/admin/system" element={<RequireAdmin><AppShell nav={ADMIN_NAV}><AdminSystem /></AppShell></RequireAdmin>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
