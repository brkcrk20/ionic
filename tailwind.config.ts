import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#3A3A3A",
        foreground: "#F3F1EC",
        accent: "#B87332",
        customText: "#3A3A3A",
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        ion: ['IonStyle', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;