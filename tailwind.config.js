/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101418',
          soft: '#1a2027',
          mute: '#3d4652'
        },
        gold: {
          DEFAULT: '#c8a24a',
          light: '#e3c886',
          dark: '#a58133'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
};
