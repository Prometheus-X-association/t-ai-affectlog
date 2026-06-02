/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#030712",
          900: "#050c1a",
          800: "#0a1628",
          700: "#0f2040",
          600: "#152952",
        },
        surface: {
          950: "#0a0f1e",
          900: "#0f172a",
          800: "#1e293b",
          700: "#253047",
          600: "#334155",
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
        },
      },
      fontFamily: {
        sans: [
          "InterVariable",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', "ui-monospace", "monospace"],
      },
      animation: {
        "glow-pulse": "pulse-glow 2.5s ease-in-out infinite",
        "float":      "float 4s ease-in-out infinite",
        "fade-in":    "fadeIn 0.4s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      backgroundImage: {
        "grid-subtle": "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "64px 64px",
      },
      boxShadow: {
        "glow-cyan":   "0 0 32px rgba(34,211,238,0.15), 0 0 64px rgba(34,211,238,0.06)",
        "glow-violet": "0 0 32px rgba(167,139,250,0.15), 0 0 64px rgba(167,139,250,0.06)",
        "card":        "0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
        "card-lg":     "0 8px 24px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
