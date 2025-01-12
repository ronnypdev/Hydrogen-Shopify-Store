import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A2A3A',
          navyLight: '#2A3A4A',
          cream: '#F5F2EA',
          gold: '#C3A343',
          goldDark: '#B39333',
          gray: '#8C8C8C',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        source: ['Source Sans Pro', 'sans-serif'],
      },
    },
  },
} satisfies Config;

export default config;
