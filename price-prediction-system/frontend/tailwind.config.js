/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#171717",
          light: "#262626",
          dark: "#0f0f0f"
        },
        forest: {
          DEFAULT: "#06110C",
          light: "#0d2419",
          dark: "#030806"
        },
        crimson: {
          DEFAULT: "#A31C1B",
          hover: "#8E1817",
          light: "#BE2221",
          muted: "rgba(163, 28, 27, 0.15)"
        },
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