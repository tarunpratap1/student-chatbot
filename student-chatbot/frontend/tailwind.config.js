/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        glassBlue: '#6fb3ff',
        glassPink: '#ff7eb6',
        glassPurple: '#9b8cff',
        glassTeal: '#6fffd2',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(1200px circle at 10% 10%, rgba(111,179,255,0.15), transparent 40%), radial-gradient(800px circle at 90% 20%, rgba(255,126,182,0.12), transparent 40%), radial-gradient(1000px circle at 50% 90%, rgba(155,140,255,0.12), transparent 40%)',
      },
    },
  },
  plugins: [],
};
