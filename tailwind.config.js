/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        newsprint: {
          DEFAULT: '#f5f2e9',
          dark: '#e8e4d9',
        },
        ink: {
          black: '#0d0d0d',
          dark: '#1a1a1a',
          medium: '#333333',
          fade: '#5c5c5c',
          light: '#8a8a8a',
        },
        accent: {
          red: '#8b0000',
          gold: '#b8860b',
        },
      },
      fontFamily: {
        masthead: ['"IM Fell English SC"', 'serif'],
        headline: ['"Playfair Display"', 'serif'],
        body: ['"Libre Baskerville"', 'Georgia', 'serif'],
        ui: ['"Source Sans Pro"', 'sans-serif'],
        tagline: ['"Old Standard TT"', 'serif'],
      },
      maxWidth: {
        'newspaper': '1400px',
        'article': '700px',
      },
    },
  },
  plugins: [],
}
