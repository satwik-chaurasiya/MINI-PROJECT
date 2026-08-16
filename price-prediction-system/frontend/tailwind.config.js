/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainDark: "#0D1117",
        cardDark: "#161B22",
        surfaceDark: "#21262D",
        electricBlue: "#2979FF",
        dropGreen: "#00C853",
        waitAmber: "#FFB300"
      }
    },
  },
  plugins: [],
}