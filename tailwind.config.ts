import type { Config } from "tailwindcss";

// Design tokens derived from the official Nasah Group LTD logo:
// red arrow/N mark on white, black wordmark with red accent on the "A"s.
// Adjust `nasah.red` to the exact brand hex once you have it from your
// brand guidelines / design file (this is a close visual match).
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nasah: {
          red: "#E4231D",
          "red-dark": "#C11B17",
          "red-tint": "#FDECEC",
          black: "#0A0A0A",
          ink: "#111111",
          gray: "#6B7280",
          border: "#E5E7EB",
          surface: "#F8F8F8",
          "dark-bg": "#0A0A0A",
          "dark-surface": "#161616",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["72px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        h1: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["36px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        body: ["18px", { lineHeight: "1.6" }],
      },
      borderRadius: {
        card: "16px",
        control: "10px",
      },
      boxShadow: {
        card: "0 20px 40px -20px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
