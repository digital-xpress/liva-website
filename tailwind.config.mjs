/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5f6c5a',
        'primary-hover': '#4d5848',
        'primary-light': '#7a8975',
        'background-light': '#f7f7f7',
        'background-dark': '#191a18',
        'surface-light': '#ffffff',
        'surface-dark': '#2a2b28',
        'surface-dark-2': '#232420',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'blur-in': {
          '0%': { opacity: '0', filter: 'blur(8px)', transform: 'translateY(16px)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'icon-spin': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(15deg) scale(1.05)' },
          '75%': { transform: 'rotate(-15deg) scale(1.05)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.7s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.7s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'blur-in': 'blur-in 0.8s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'gradient-shift': 'gradient-shift 5s ease infinite',
        'icon-spin': 'icon-spin 3s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
