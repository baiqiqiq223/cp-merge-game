/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1e2230',
        paper: '#fff8e8',
        coral: '#ff6b57',
        mint: '#48d6b5',
        gold: '#ffd166',
        sky: '#58a6ff'
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
}
