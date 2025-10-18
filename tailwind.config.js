/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Lora', 'serif'],
        'display': ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(59,130,246,0.35)',
        'glow-lg': '0 0 60px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3)',
        'aurora': '0 10px 40px rgba(147, 51, 234, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.12)',
        'inner-glow': 'inset 0 2px 12px rgba(255, 255, 255, 0.1)',
      },
      colors: {
        pastel: {
          blue: '#eaf6ff',
          purple: '#f3e8ff',
          pink: '#fce7f3',
          cyan: '#cffafe',
        },
        midnight: {
          950: '#050819',
          900: '#0b1220',
          800: '#0e1a2b',
          700: '#132338',
          600: '#19304a',
          500: '#204061',
          400: '#2b5a86',
          300: '#3b7bb3',
          200: '#5a9dd6',
        },
        aurora: {
          purple: '#9333ea',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '50%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
