import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F5F1",
        surface: "#FFFFFF",
        ink: "#161A21",
        "ink-muted": "#5B6270",
        "ink-faint": "#8A8F99",
        border: "#E3E0D8",
        accent: "#0E6B57",
        "accent-soft": "#E3F0EB",
        "accent-strong": "#0A5344",
        down: "#A8431F",
        "down-soft": "#F6E9E2",
        up: "#0E6B57",
        "up-soft": "#E3F0EB",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1, "lnum" 1',
      },
    },
  },
  plugins: [],
};
export default config;
