
export default {
  content: [
    "./index.html",
    "./src*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B110A',
        surface: '#121212',
        card: '#1C211B',
        primary: {
          DEFAULT: '#A3C148',
          hover: '#B4D159',
        },
        text: {
          heading: '#F4F4F4',
          body: '#A0A0A0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}