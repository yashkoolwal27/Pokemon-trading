import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pogo: {
          blue: "#0070e0",
          yellow: "#ffcb05",
          darkblue: "#1b2a4a",
          valor: "#ea2f2f",
          mystic: "#0075ff",
          instinct: "#fed000",
        },
      },
    },
  },
  plugins: [],
};

export default config;
