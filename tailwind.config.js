/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rooted Heritage tokens
        surface: {
          DEFAULT: '#fbf9f8',
          dim: '#dbd9d9',
          bright: '#fbf9f8',
          tint: '#4d6453',
          variant: '#e4e2e2',
        },
        container: {
          lowest: '#ffffff',
          low: '#f5f3f3',
          DEFAULT: '#efeded',
          high: '#eae8e7',
          highest: '#e4e2e2',
        },
        ink: {
          DEFAULT: '#1b1c1c',
          variant: '#434843',
          inverse: '#f2f0f0',
        },
        outline: {
          DEFAULT: '#737973',
          variant: '#c3c8c1',
        },
        primary: {
          50:  '#eef4f0',
          100: '#d0e9d4',
          200: '#b4cdb8',
          300: '#819986',
          400: '#4d6453',
          500: '#364c3c',
          600: '#1b3022',
          700: '#0b2013',
          DEFAULT: '#061b0e',
          on: '#ffffff',
          container: '#1b3022',
          'on-container': '#819986',
          fixed: '#d0e9d4',
          'fixed-dim': '#b4cdb8',
          inverse: '#b4cdb8',
        },
        secondary: {
          DEFAULT: '#5e5e5b',
          on: '#ffffff',
          container: '#e1dfdb',
          'on-container': '#63635f',
        },
        tertiary: {
          DEFAULT: '#231401',
          on: '#ffffff',
          container: '#3a2810',
          'on-container': '#a98e6e',
          fixed: '#fdddb9',
          'fixed-dim': '#e0c29f',
          accent: '#a98e6e',
        },
        danger: {
          DEFAULT: '#ba1a1a',
          on: '#ffffff',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '1.1', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-sm': ['13px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      spacing: {
        'xs': '4px',
        'gutter': '24px',
        'margin': '32px',
      },
      boxShadow: {
        // Soft, forest-tinted ambient shadows — "Digital Heirloom"
        'card':       '0 1px 2px rgba(6,27,14,0.04), 0 2px 8px rgba(6,27,14,0.05)',
        'card-hover': '0 2px 4px rgba(6,27,14,0.06), 0 8px 24px rgba(6,27,14,0.08)',
        'modal':      '0 24px 60px -16px rgba(6,27,14,0.18), 0 8px 24px rgba(6,27,14,0.08)',
        'inset-paper':'inset 0 1px 2px rgba(6,27,14,0.06)',
        'embossed':   'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 2px rgba(6,27,14,0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
      },
      maxWidth: {
        'content': '1280px',
      },
    },
  },
  plugins: [],
}
