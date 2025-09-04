import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: {
          light: 'rgb(var(--primary-light))',
          DEFAULT: 'rgb(var(--primary-default))',
        },
        secondary: {
          light: 'rgb(var(--secondary-light))',
          DEFAULT: 'rgb(var(--secondary-default))',
        },
        accent: {
          light: 'rgb(var(--accent-light))',
          DEFAULT: 'rgb(var(--accent-default))',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
