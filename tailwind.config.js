const { text } = require('stream/consumers');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0c232d',
        panel: '#27343aff',
        muted: '#2f7a91',
        line: '#666674ff',
        accent: '#d9b70d',
        text: '#b31398ff',
      },
      boxShadow: {
        card: '0 1px 0 0 #1717acff, 0 8px 20px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
