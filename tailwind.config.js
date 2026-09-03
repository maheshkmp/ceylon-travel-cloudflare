/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        background: "var(--color-surface)",
        foreground: "var(--color-text-primary)",
        border: "var(--color-border)",
        muted: {
          DEFAULT: "var(--color-surface-2)",
          foreground: "var(--color-text-secondary)",
        },
        popover: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text-primary)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text-primary)",
        },
        primary: {
          DEFAULT: "var(--color-brand)",
          foreground: "white",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "white",
        },
        gold: {
          DEFAULT: "#4cb2e1ff",
          light: "#DFC090",
          dark: "#A8864A",
        },
        jungle: {
          DEFAULT: "#1A2E1A",
          light: "#2A4A2A",
        },
        ink: {
          DEFAULT: "#0A0A08",
          soft: "#111110",
        },
        ivory: {
          DEFAULT: "#F7F4EF",
          warm: "#EDE9E1",
        },
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
        widest4: "0.4em",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
