/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#F0D49C',
          400: '#E5C07B',
          500: '#D4AF37',
          600: '#B8972E',
          700: '#94751F',
        },
        rose: {
          50: '#FDF8F7',
          100: '#F9ECE8',
          200: '#F4D9D2',
          300: '#EABBB0',
          500: '#D87A68',
          800: '#8A3E31',
          900: '#5A261D',
        },
        noir: {
          900: '#121110',
          800: '#1C1917',
          700: '#292524',
          600: '#44403C',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F3EA',
          200: '#EFE8DA',
        }
      }
    },
  },
  plugins: [],
}
