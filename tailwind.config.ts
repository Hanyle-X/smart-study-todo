import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F7",
        foreground: "#1D1D1F",
        muted: "#6E6E73",
        primary: "#007AFF",
        success: "#30D158",
        attention: "#FF9F0A"
      },
      borderRadius: {
        widget: "24px"
      },
      boxShadow: {
        widget: "0 18px 45px rgba(0, 0, 0, 0.06)"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
