/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue: {
            DEFAULT: '#2874f0',
            dark: '#1e5cc2',
            light: '#f1f3f6'
          },
          yellow: {
            DEFAULT: '#ffc200',
            dark: '#e0a800',
          }
        }
      }
    },
  },
  plugins: [],
}
