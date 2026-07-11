/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Spotify-inspired dark theme palette — reused everywhere via these tokens
        background: "#0d0d0d",
        surface: "#181818",
        surfaceHover: "#282828",
        primary: "#1db954", // Spotify green accent
        textPrimary: "#ffffff",
        textSecondary: "#b3b3b3",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};