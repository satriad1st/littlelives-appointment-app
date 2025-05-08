import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      inherit: "inherit",
      black: {
        DEFAULT: "#2C2C2C",
        "500": "#222121",
        "900": "#000000",
      },
      white: {
        DEFAULT: "#EAEAEA",
      },

      primary: {
        DEFAULT: "#00F5A0",
      },
      gray: {
        DEFAULT: "#B0B0B0",
        700: "#3F3F3F",
      },
      green: {
        DEFAULT: "#00F5A0",
        700: "#1e684f",
      },
      red: {
        DEFAULT: "#EB2626",
        700: "#6a201f",
      },
    },

    extend: {
      boxShadow: {
        xs: "0 0 2px 0 #EAEAEA4D",
      },
      dropShadow: {
        default: "0 0 20px rgba(0, 0, 0, 0.10)",
      },

      keyframes: {
        draw: {
          "0%": { "stroke-dashoffset": "var(--path-length)" },
          "100%": { "stroke-dashoffset": "0" },
        },
      },
      animation: {
        draw: "draw 1s ease forwards",
        "spin-slow": "spin 3s linear infinite",
      },

      gradientColorStops: {
        placeholder1: "#EAEAEA",
        placeholder2: "#7A7A7A",
      },

      borderRadius: {
        lg: "var(--radius)",
        lg2: "calc(var(--radius) + 2px)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontSize: {
        "3xs": ["0.5rem", { lineHeight: "1" }],
        "2xs": ["0.625rem", { lineHeight: "1" }],

        "2.5xl": ["1.625rem", { lineHeight: "1" }],
      },

      zIndex: {
        "100": "100",
        "150": "150",
        "200": "200",
        "250": "250",
        "300": "300",
        "400": "400",
        "500": "500",
        "1000": "1000",
      },

      fontFamily: {
        figtree: ["var(--font-figtree)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
