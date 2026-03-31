/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['2.986rem', { lineHeight: '1.25', letterSpacing: '0' }], // 48px
        'display-2': ['2.488rem', { lineHeight: '1.25', letterSpacing: '0' }], // 40px
        'display-3': ['2.074rem', { lineHeight: '1.25', letterSpacing: '0' }], // 34px
        'display-4': ['1.728rem', { lineHeight: '1.25', letterSpacing: '0' }], // 28px
        'display-5': ['1.440rem', { lineHeight: '1.25', letterSpacing: '0' }], // 24px
        'display-6': ['1.200rem', { lineHeight: '1.25', letterSpacing: '0' }], // 20px
        'body-lg': ['1rem', { lineHeight: '1.25', letterSpacing: '0' }], // 16px
        'body-sm': ['0.833rem', { lineHeight: '1.25', letterSpacing: '0' }], // 14px
        'body-xs': ['0.694rem', { lineHeight: '1.25', letterSpacing: '0' }], // 12px
      },
      fontWeight: {
        regular: '400',
        bold: '700',
      },
      colors: {
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
          1000: 'var(--gray-1000)',
          1100: 'var(--gray-1100)',
          1200: 'var(--gray-1200)',
          1300: 'var(--gray-1300)',
          1400: 'var(--gray-1400)',
          1500: 'var(--gray-1500)',
        },
        orange: {
          100: 'var(--orange-100)',
          200: 'var(--orange-200)',
          300: 'var(--orange-300)',
          400: 'var(--orange-400)',
          500: 'var(--orange-500)',
          600: 'var(--orange-600)',
          700: 'var(--orange-700)',
          800: 'var(--orange-800)',
          900: 'var(--orange-900)',
          1000: 'var(--orange-1000)',
          1100: 'var(--orange-1100)',
          1200: 'var(--orange-1200)',
          1300: 'var(--orange-1300)',
          1400: 'var(--orange-1400)',
          1500: 'var(--orange-1500)',
        },
        red: {
          100: 'var(--red-100)',
          200: 'var(--red-200)',
          300: 'var(--red-300)',
          400: 'var(--red-400)',
          500: 'var(--red-500)',
          600: 'var(--red-600)',
          700: 'var(--red-700)',
          800: 'var(--red-800)',
          900: 'var(--red-900)',
          1000: 'var(--red-1000)',
          1100: 'var(--red-1100)',
          1200: 'var(--red-1200)',
          1300: 'var(--red-1300)',
          1400: 'var(--red-1400)',
          1500: 'var(--red-1500)',
        },
      },
      boxShadow: {
        'custom-glow': '0 0 8px 0 rgba(0, 0, 0, 0.35)',
        'content-card': '2px 2px 4px 0px rgba(0, 0, 0, 0.25)',
        'desktop-card': '2px 2px 4px 0px #00000040',
        'modal': '0px 11px 15px -7px #00000033, 0px 24px 38px 3px #00000024, 0px 9px 46px 8px #0000001F',
      },
    },
  },
  plugins: [],
};
