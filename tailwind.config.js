/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a',
        mist: '#f6f7fb',
        accent: '#6366f1',
        citrus: '#f59e0b',
        ocean: '#0ea5e9',
        lime: '#84cc16',
        blush: '#f472b6',
      },
      boxShadow: {
        card: '0 20px 60px rgba(15, 23, 42, 0.1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 400ms ease-out',
      },
    },
  },
  plugins: [],
}
