import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ece8e3',
          300: '#ddd7cf',
          400: '#c4bab0',
          500: '#a69b8f',
          600: '#8a7e72',
          700: '#6e6459',
          800: '#524a41',
          900: '#2c2620',
          950: '#1a1714',
        },
        primary: {
          DEFAULT: '#0f0f0f',
          light: '#4a4a4a',
        },
        accent: {
          DEFAULT: '#b8956b',
          light: '#d4b896',
          dark: '#8c6d47',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'widest-xl': '0.2em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
