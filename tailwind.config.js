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
        midnight: {
          900: '#0b1220',
          800: '#0e1a2b',
          700: '#132338',
          600: '#19304a',
          500: '#204061',
          400: '#2b5a86',
          300: '#3b7bb3',
        },
      },
    },
  },
  plugins: [],
}
