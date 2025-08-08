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
        bg: '#21212bff',
        panel: '#141417',
        muted: '#1c1c20',
        line: '#232329',
        accent: '#8b5cf6',
      },
      boxShadow: {
        card: '0 1px 0 0 #232329, 0 8px 20px rgba(0,0,0,.35)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
