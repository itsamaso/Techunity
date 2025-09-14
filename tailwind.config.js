/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      
      },
    },
    extend: {
      colors: {
        // New gradient theme colors
        'primary-500': '#3B82F6', // Blue-500
        'primary-600': '#2563EB', // Blue-600
        'primary-400': '#60A5FA', // Blue-400
        'primary-300': '#93C5FD', // Blue-300
        'secondary-500': '#8B5CF6', // Purple-500
        'secondary-600': '#7C3AED', // Purple-600
        'secondary-400': '#A78BFA', // Purple-400
        'secondary-300': '#C4B5FD', // Purple-300
        'accent-500': '#EC4899', // Pink-500
        'accent-600': '#DB2777', // Pink-600
        'accent-400': '#F472B6', // Pink-400
        'accent-300': '#F9A8D4', // Pink-300
        'off-white': '#F8FAFC',
        'red': '#E57373',
        'dark-1': '#F8FAFC',
        'dark-2': '#F1F5F9',
        'dark-3': '#E2E8F0',
        'dark-4': '#CBD5E1',
        'light-1': '#1E293B',
        'light-2': '#334155',
        'light-3': '#64748B',
        'light-4': '#94A3B8',
      },
      screens: {
        'xs': '480px',
      
      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
