/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#A855F7',
        dark: '#0F172A',
        'dark-light': '#1E293B',
      },
      animation: {
        'glow-pulse': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(14, 165, 233, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
