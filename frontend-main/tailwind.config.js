/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'asceta-blue': '#1e40af',
        'asceta-dark-blue': '#1e3a8a',
        'asceta-red': '#dc2626',
        'asceta-dark-red': '#b91c1c',
      },
    },
  },
  plugins: [],
}

