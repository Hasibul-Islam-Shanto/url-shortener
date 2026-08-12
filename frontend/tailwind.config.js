/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base': '#0B0D17',
        glass: 'rgba(255,255,255,0.06)',
        'glass-border': 'rgba(129,140,248,0.15)',
        'accent-start': '#6366F1',
        'accent-end': '#A855F7',
        'status-active': '#10B981',
      },
      boxShadow: {
        glow: '0 0 24px rgba(99, 102, 241, 0.45)',
        glowSm: '0 0 12px rgba(99, 102, 241, 0.3)',
        glowCard: '0 0 8px rgba(99, 102, 241, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
};
