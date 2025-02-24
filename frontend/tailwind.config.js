/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#000000',
          light: '#1a1a1a'
        },
        orange: {
          DEFAULT: '#FF5722',
          light: '#FF7A50',
          dark: '#E64A19'
        },
        white: {
          DEFAULT: '#FFFFFF',
          off: '#F5F5F5',
          dim: '#EEEEEE'
        }
      },
      boxShadow: {
        glow: '0 0 15px rgba(255, 87, 34, 0.5)',
        'glow-soft': '0 0 20px rgba(255, 87, 34, 0.3)'
      }
    },
  },
  plugins: [],
}

