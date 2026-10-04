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
        indigo: {
          50: '#F0F4F8',
          100: '#E0E8F2',
          200: '#C2D2E4',
          600: '#2A5584',
          700: '#1E3E62',
          800: '#152945',
          900: '#0B192C',
          950: '#07101E',
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          900: '#78350F',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
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
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
