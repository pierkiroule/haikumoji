/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(59,130,246,0.35)',
      },
      colors: {
        pastel: {
          blue: '#eaf6ff',
        },
      },
    },
  },
  plugins: [],
}
