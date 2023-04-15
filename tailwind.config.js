/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#1BB954",
        primary: "#fff",
        secondary: "#ffc107",
        tertiary: "#34d399",
        quaternary: "#FFD365",
        quinary: "#FDFFA9",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
