/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#228B22',
        'eco-green': '#2D5016',
        'light-green': '#90EE90',
      },
    },
  },
  plugins: [],
}
