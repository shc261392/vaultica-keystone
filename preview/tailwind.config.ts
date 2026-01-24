import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand colors from tokens
        brand: {
          black: "#363b42",
          white: "#f0fbff",
          blue: "#27abec",
        },
        // Bootstrap compatibility
        bootstrap: {
          light: "#d7e9f2",
          dark: "#363b42",
          primary: "#27abec",
          secondary: "#1b67a1",
          info: "#f0d15e",
          success: "#13c16a",
          warning: "#eed210",
          danger: "#fe1b20",
        },
        // Vault semantic colors
        vault: {
          surface: {
            primary: "oklch(12% 0.008 256)",
            secondary: "oklch(16% 0.01 256)",
            tertiary: "oklch(22% 0.012 256)",
          },
          border: {
            default: "oklch(30% 0.015 256)",
            strong: "oklch(45% 0.02 230)",
            subtle: "oklch(22% 0.012 256)",
          },
          text: {
            primary: "#f0fbff",
            secondary: "oklch(75% 0.015 230)",
            tertiary: "oklch(60% 0.018 230)",
          },
          accent: {
            DEFAULT: "#27abec",
            hover: "oklch(78% 0.12 236)",
            active: "oklch(62% 0.14 236)",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
