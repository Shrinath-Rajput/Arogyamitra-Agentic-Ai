/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          dark: '#0f172a',
          panel: '#1e293b',
          gray: '#334155'
        }
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
        'neon-teal': '0 0 10px rgba(20, 184, 166, 0.5), 0 0 20px rgba(20, 184, 166, 0.3)',
        'neon-emerald': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
        'glass-sm': '0 4px 16px rgba(31, 38, 135, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '20px',
      }
    },
  },
  plugins: [],
}
