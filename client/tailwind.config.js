/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#0a0c10',
        surface: '#111318',
        surface2: '#181c24',
        border: '#252a35',
        accent: '#4fffb0',
        accent2: '#7c6cff',
        accent3: '#ff6c6c',
        text: '#e8eaf2',
        text2: '#8b91a8',
        text3: '#555d75',
      },
    },
  },
  plugins: [],
};
