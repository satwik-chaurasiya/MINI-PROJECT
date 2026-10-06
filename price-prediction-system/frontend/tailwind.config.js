/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainDark: "var(--main-bg)",
        cardDark: "var(--card-bg)",
        surfaceDark: "var(--surface-bg)",
        electricBlue: "var(--electric-blue)",
        dropGreen: "var(--drop-green)",
        waitAmber: "var(--wait-amber)",
        white: "var(--text-main)",
        tabActive: "var(--tab-active-bg)",
        tabHover: "var(--tab-hover-bg)",
        gray: {
          300: "var(--text-muted)",
          400: "var(--text-muted-dark)"
        }
      }
    },
  },
  plugins: [],
}