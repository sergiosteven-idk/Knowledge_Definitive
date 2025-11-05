const plugin = require('tailwindcss/plugin');

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--color-primary'),
        'primary-strong': withOpacity('--color-primary-strong'),
        secondary: withOpacity('--color-secondary'),
        accent: withOpacity('--color-accent'),
        success: withOpacity('--color-success'),
        warning: withOpacity('--color-warning'),
        danger: withOpacity('--color-danger'),
        info: withOpacity('--color-info'),
        muted: withOpacity('--color-muted'),
        surface: withOpacity('--color-surface'),
        background: withOpacity('--color-background'),
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-family-base)', 'sans-serif'],
        heading: ['var(--font-family-heading)', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.focus-outline': {
          outline: '3px solid var(--color-accent)',
          outlineOffset: '3px',
        },
      });
    }),
  ],
};
