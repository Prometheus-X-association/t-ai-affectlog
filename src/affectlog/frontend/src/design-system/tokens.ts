export const colors = {
  // Near-black / navy backgrounds
  navy: {
    950: "#030712",
    900: "#050c1a",
    800: "#0a1628",
    700: "#0f2040",
    600: "#152952",
  },
  // White and off-white surfaces
  surface: {
    0: "#ffffff",
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
  },
  // Electric blue / cyan accents
  cyan: {
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
  },
  electric: {
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
  },
  // Violet for explainability
  violet: {
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
  },
  // Green for privacy/compliance
  emerald: {
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
  },
  // Amber for warnings only
  amber: {
    400: "#fbbf24",
    500: "#f59e0b",
  },
  // Red for risk/error
  red: {
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
  },
} as const;

export const typography = {
  scale: {
    hero: { size: "4rem", lineHeight: "1.1", weight: "700" },
    h1: { size: "3.5rem", lineHeight: "1.1", weight: "700" },
    h2: { size: "2.5rem", lineHeight: "1.2", weight: "600" },
    h3: { size: "1.75rem", lineHeight: "1.3", weight: "600" },
    body: { size: "1rem", lineHeight: "1.625", weight: "400" },
    small: { size: "0.875rem", lineHeight: "1.5", weight: "400" },
    mono: { size: "0.8125rem", lineHeight: "1.5", weight: "400" },
  },
  fonts: {
    sans: '"InterVariable", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
  },
} as const;

export const spacing = {
  section: { sm: "4rem", md: "6rem", lg: "8rem" },
  container: { max: "72rem", pad: "1.5rem" },
} as const;

export const motion = {
  duration: { fast: 0.15, normal: 0.25, slow: 0.4, slower: 0.6 },
  ease: {
    out: [0.0, 0.0, 0.2, 1.0],
    in: [0.4, 0.0, 1.0, 1.0],
    inOut: [0.4, 0.0, 0.2, 1.0],
    spring: { type: "spring", stiffness: 260, damping: 20 },
  },
} as const;

export const shadows = {
  glow: {
    cyan: "0 0 32px rgba(34,211,238,0.15), 0 0 64px rgba(34,211,238,0.06)",
    violet: "0 0 32px rgba(139,92,246,0.15), 0 0 64px rgba(139,92,246,0.06)",
    emerald: "0 0 32px rgba(16,185,129,0.12), 0 0 64px rgba(16,185,129,0.05)",
  },
  card: {
    sm: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
    lg: "0 8px 24px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
  },
} as const;

export const gradients = {
  hero: "radial-gradient(ellipse 100% 80% at 50% -10%, #0f1f3d 0%, #030712 70%)",
  heroAccent: "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(34,211,238,0.06) 0%, transparent 70%)",
  navyToSurface: "linear-gradient(180deg, #050c1a 0%, #0a1628 100%)",
  cardGlass: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
  cyanEdge: "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)",
  violetEdge: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
  sectionDark: "linear-gradient(180deg, #030712 0%, #050c1a 100%)",
} as const;
