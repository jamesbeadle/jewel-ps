/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Jewel Enterprise brand guidelines 2026 — Jewel Property Serve palette
        gold: {
          DEFAULT: '#C09A51', // Jewel Gold (shared enterprise colour)
          light: '#D8B970',
          dark: '#9A7A3C'
        },
        blue: {
          DEFAULT: '#135EAA', // PS Blue
          light: '#2F7FD3',
          deep: '#0C4482'
        },
        grey: '#BBBBBB', // PS Grey
        // Blue-tinted dark surfaces (derived from PS Blue, not a logo colour)
        night: {
          DEFAULT: '#080C14',
          2: '#0E1420',
          3: '#151D2D',
          4: '#1E2941'
        }
      },
      fontFamily: {
        display: ['Switzer', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['"Geom Graphic"', 'Outfit', 'Inter', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        site: '80rem'
      },
      letterSpacing: {
        kicker: '0.22em'
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(19, 94, 170, 0.55)',
        card: '0 30px 60px -30px rgba(0, 0, 0, 0.7)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' }
        }
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        pulseRing: 'pulseRing 2.2s cubic-bezier(0.2, 0.6, 0.2, 1) infinite'
      }
    }
  },
  plugins: []
};
