/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rosa': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        'nude': {
          50: '#faf5f3',
          100: '#f5ebe7',
          200: '#e8d5cd',
          300: '#d9bdb0',
          400: '#c9a28e',
          500: '#ba8b74',
          600: '#a8755c',
          700: '#8c5d48',
          800: '#744c3c',
          900: '#5f3e32',
        }
      }
    },
  },
  plugins: [],
}
