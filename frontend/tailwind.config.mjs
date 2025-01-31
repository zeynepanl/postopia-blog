/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#6B46C1", // Mor tonunu ayarla
        secondary: "#A78BFA", // Daha açık mor tonu
        accent: "#FBBF24", // Sarı vurgu rengi
      },
      fontFamily: {
        alegreya: ["var(--font-alegreya)", "serif"], // Alegreya fontunu Tailwind'e ekledik
      },
    },
  },
  plugins: [],
};
