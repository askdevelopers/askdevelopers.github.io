/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Satoshi + Clash Display from Fontshare (see index.html); JetBrains Mono for small labels.
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Satoshi', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Section-scoped tokens — see .theme-dark / .theme-light in index.css.
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        card: 'rgb(var(--c-card) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        link: 'rgb(var(--c-link) / <alpha-value>)',
        // Charcoal surfaces
        ink: {
          950: '#0c0c0c',
          900: '#141414',
          800: '#1f1f1f',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#4a4a4a',
        },
        // Orange accent
        brand: {
          200: '#ffd9c7',
          300: '#ffb08a',
          400: '#ff7a45',
          500: '#ff5a1f',
          600: '#e04e14',
          700: '#b83c0c',
        },
        // Amber secondary (gradient end, secondary dots)
        amber: {
          300: '#ffd166',
          400: '#ffc247',
          500: '#f5a623',
          600: '#d98c12',
        },
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgb(var(--c-line) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-line) / 0.05) 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(120deg, #ff5a1f 0%, #ffc247 100%)',
      },
      boxShadow: {
        tile: '0 2px 12px rgba(26,26,26,0.06), 0 0 0 1px rgba(26,26,26,0.04)',
        'tile-hover': '0 18px 40px -16px rgba(26,26,26,0.24), 0 0 0 1px rgba(26,26,26,0.05)',
        glow: '0 0 0 1px rgba(255,90,31,0.25), 0 20px 60px -20px rgba(255,90,31,0.5)',
        'glow-accent': '0 30px 80px -30px rgba(255,90,31,0.55)',
        card: '0 10px 40px -15px rgba(0,0,0,0.6)',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        blink: 'blink 1.4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%,100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
      },
    },
  },
  plugins: [],
};
