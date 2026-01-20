/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'navy': '#160D76',
          'blue': '#4094d9',
          'orange': '#F08530',
          'white': '#FFFFFA',
          'black': '#222222',
        },
        'custom': {
          'success': '#10b981',
          'danger': '#ef4444',
          'warning': '#f59e0b',
        }
      },
      fontFamily: {
        'serif': ['Cardo', 'serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      },
      boxShadow: {
        'brand': '0 2px 8px rgba(22, 13, 118, 0.1)',
        'brand-lg': '0 10px 30px rgba(22, 13, 118, 0.15)',
      }
    },
  },
  plugins: [],
}
