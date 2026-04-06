/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          from: "#7C3AED",
          to: "#EC4899",
          hoverFrom: "#6D28D9",
          hoverTo: "#DB2777",
        },
      },
    },
  },
  plugins: [],
};
