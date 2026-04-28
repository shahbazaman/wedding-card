/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        vibes: ['"Great Vibes"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gold: '#d4af7a',
        'gold-dark': '#b8926a',
        'gold-light': '#f0d8a8',
        crimson: '#c0392b',
        'dark-bg': '#0a0202',
        'dark-card': '#120505',
      },
    },
  },
  plugins: [],
}
