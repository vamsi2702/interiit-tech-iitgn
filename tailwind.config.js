/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-blue': '#0891b2',
        'eco-teal': '#14b8a6',
        'eco-cyan': '#06b6d4',
        'eco-dark': '#0e7490',
        'eco-light': '#67e8f9',
      },
    },
  },
  plugins: [],
}
