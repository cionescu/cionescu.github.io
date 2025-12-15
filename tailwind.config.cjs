const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'vadim-bg': '#FAFAF9',
        'vadim-text': '#1A1A1A',
        'vadim-gray': '#666666',
        'guide-blue': '#E0F2FE',
        'guide-yellow': '#FEFCE8',
        'guide-peach': '#FFF7ED',
        'accent-orange': '#F97316',
        'accent-blue': '#2563EB',
        primary: {
          DEFAULT: '#6B69FA',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#E0DFFE',
          300: '#B9B8FD',
          400: '#9290FB',
          500: '#6B69FA',
          600: '#3533F8',
          700: '#0B08EB',
          800: '#0806B5',
          900: '#06047E',
          950: '#050363'
        },
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
