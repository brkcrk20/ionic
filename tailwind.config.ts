import type { Config } from "tailwindcss";

export default {
  content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {
      colors: {
        background: "#FDFCFB", // Ionic Stone tarzı kırık beyaz/taş tonu
        foreground: "#1A1A1A", // Çok koyu gri/siyah
        accent: "#C5A059",    // Altın/bronz dokunuş
      },
    },
  },
  plugins: [],
} satisfies Config;