/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151312",
        paper: "#faf8f5",
        accent: "#0e8a6d",
        warm: "#f0e3cf"
      }
    },
  },
  plugins: [],
};
