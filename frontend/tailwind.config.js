/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mota: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        tribal: {
          gold: '#d97706',
          ochre: '#b45309',
          brown: '#78350f',
          dark: '#1e293b'
        }
      },
    },
  },
  plugins: [],
}
