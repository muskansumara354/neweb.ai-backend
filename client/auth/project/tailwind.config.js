/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};