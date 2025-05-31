/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        chakra: ['"Chakra Petch"', 'sans-serif'],
        chivo: ['"Chivo"', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
        play: ['"Play"', 'sans-serif'],
        tajawal: ['"Tajawal"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
