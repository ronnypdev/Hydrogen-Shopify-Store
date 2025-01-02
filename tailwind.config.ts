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
          cream: '#F5F2EA',
          gold: '#C3A343',
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
