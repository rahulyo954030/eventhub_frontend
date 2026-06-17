/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        display: '-0.03em',
        caps: '0.16em',
        eyebrow: '0.22em',
      },
      colors: {
        primary: {
          50: '#f3f8f7',
          100: '#dceee9',
          200: '#b8ddd3',
          300: '#8ac5b6',
          400: '#5da896',
          500: '#3d8b7a',
          600: '#2f7062',
          700: '#285a4f',
          800: '#234a42',
          900: '#1f3e38',
          950: '#0f2420',
        },
        surface: {
          DEFAULT: '#faf8f5',
          card: '#ffffff',
          muted: '#f1efeb',
          elevated: '#ffffff',
        },
        ink: {
          DEFAULT: '#1a1816',
          muted: '#5c5650',
          faint: '#8a837b',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26, 24, 22, 0.04), 0 8px 24px rgba(26, 24, 22, 0.06)',
        card: '0 1px 3px rgba(26, 24, 22, 0.05), 0 12px 32px rgba(26, 24, 22, 0.07)',
        lift: '0 4px 14px rgba(26, 24, 22, 0.08), 0 20px 48px rgba(26, 24, 22, 0.06)',
        glow: '0 0 0 1px rgba(47, 112, 98, 0.08), 0 8px 24px rgba(47, 112, 98, 0.12)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(47, 112, 98, 0.09), transparent 70%)',
        'sidebar-gradient': 'linear-gradient(180deg, #141816 0%, #0f1210 100%)',
        'cta-gradient': 'linear-gradient(135deg, #1a1816 0%, #234a42 55%, #1a1816 100%)',
      },
    },
  },
  plugins: [],
};
