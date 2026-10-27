/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#04050b',
          900: '#070912',
          800: '#0c0f1c',
          700: '#131729',
          600: '#1c2138',
          500: '#2a3050',
        },
        brand: {
          200: '#c7d4ff',
          300: '#9db4ff',
          400: '#6d8dff',
          500: '#3d63ff',
          600: '#2a4cf0',
          700: '#1f3bc4',
        },
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
        },
        gold: {
          400: '#fbbf24',
        },
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(120deg, #3d63ff 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(109,141,255,0.25), 0 20px 60px -20px rgba(61,99,255,0.6)',
        'glow-violet': '0 30px 80px -30px rgba(139,92,246,0.65)',
        card: '0 10px 40px -15px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        blink: 'blink 1.4s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.4s ease-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
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
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
