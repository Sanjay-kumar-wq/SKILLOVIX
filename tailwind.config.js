/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark blue palette
        'dk-bg': '#0F1929',
        'dk-card': '#0A1120',
        'dk-border': '#1E3A5F',
        'dk-surface': '#162033',

        // Neon aliases mapped to blue palette (for backward-compat class names)
        cyber: {
          black: '#0F1929',
          dark: '#0A1120',
          card: '#0A1120',
          surface: '#162033',
          border: '#1E3A5F',
        },
        neon: {
          purple: '#2563EB',
          cyan: '#38BDF8',
          pink: '#38BDF8',
          yellow: '#38BDF8',
          green: '#10B981',
          blue: '#2563EB',
        },
        glow: {
          purple: 'rgba(37, 99, 235, 0.25)',
          cyan: 'rgba(56, 189, 248, 0.25)',
          pink: 'rgba(56, 189, 248, 0.25)',
        },

        // Semantic tokens
        primary: '#2563EB',
        secondary: '#1d4ed8',
        accent: '#38BDF8',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',

        // Legacy tokens
        'bg-dark': '#0F1929',
        'bg-card-dark': '#0A1120',
        'bg-surface-dark': '#162033',
        'bg-light': '#F8FAFC',
        'bg-card-light': '#FFFFFF',
        'bg-surface-light': '#F1F5F9',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        cyber: ['Inter', 'sans-serif'],
        rajdhani: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-in-out',
        'slide-up':  'slideUp 0.5s ease-out',
        'slide-down':'slideDown 0.3s ease-out',
        'pulse-slow':'pulse 3s infinite',
        'float':     'float 3s ease-in-out infinite',
        'glow':      'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(37, 99, 235, 0.3)' },
          '50%':      { boxShadow: '0 0 30px rgba(37, 99, 235, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
