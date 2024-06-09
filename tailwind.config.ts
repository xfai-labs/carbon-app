import type { Config } from 'tailwindcss';
import { formatRgb } from 'culori';

function createTwConfigValues(start: number, end: number, step: number) {
  const remBase = 16;
  const obj = {};
  for (let i = start; i <= end; i = i + step) {
    obj[i] = `${i / remBase}rem`;
  }
  return obj;
}

// const myColorRgb = rgb('#33CBCB');
// const myColorOklch = oklchXfai(myColorRgb);
// console.log(myColorOklch);

const oklch = (l: number, c: number, h: number) => {
  const result = formatRgb(`oklch(${l} ${c} ${h} / 0)`);
  return result.replace(', 0)', ', <alpha-value>)');
};
const lighten = (l: number, amount: number) => Math.min(l + amount, 1);
const darken = (l: number, amount: number) => Math.max(l - amount, 0);

const lightDark = (l: number, c: number, h: number) => ({
  light: oklch(lighten(l, 0.2), c, h),
  DEFAULT: oklch(l, c, h),
  dark: oklch(darken(l, 0.5), c, h),
});

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '4rem',
      },
    },
    colors: ({ colors }) => {
      // Background color variables
      const hue = 0;
      const chroma = 0; // Recommended 0.01, 0.02
      return {
        background: {
          50: oklch(0.99, chroma, hue),
          100: oklch(0.9, chroma, hue),
          200: oklch(0.85, chroma, hue),
          300: oklch(0.75, chroma, hue),
          400: oklch(0.65, chroma, hue),
          500: oklch(0.5, chroma, hue),
          600: oklch(0.4, chroma, hue),
          700: oklch(0.3, chroma, hue),
          800: oklch(0.2, chroma, hue),
          900: oklch(0.15, chroma, hue),
        },
        white: colors.white,
        transparent: colors.transparent,
        primary: lightDark(
          0.7673997134228575,
          0.12075662887784851,
          194.93099732668745
        ), // #33CBCB
        error: lightDark(
          0.5971164391943622,
          0.24078779702610975,
          23.15372690704209
        ), // #ED0131
        sell: lightDark(0.65, 0.147, 15), // #D86371 // TODO check when deployed
        buy: lightDark(0.68, 0.153, 160), // #00B578 // TODO check when deployed
        success: lightDark(
          0.7673997134228575,
          0.12075662887784851,
          194.93099732668745
        ), // #33CBCB
        warning: lightDark(0.747, 0.18, 57.36), // #ff8a00
        black: oklch(0.1822037016468545, chroma, hue),

        cyan: '#33CBCB',
        'cyan-dark': '#049494',
        magenta: '#FF0098',
        'magenta-dark': '#B0006A',
        red: '#ED0131',

        // Themed
        xfai90: 'rgb(var(--grey-90) / <alpha-value>)',
      };
    },
    spacing: createTwConfigValues(0, 100, 1),
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
      slideUp:
        'fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both, translateY 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      scaleUp:
        'fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both, scale 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
    },
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.200', 'currentColor'),
    }),
    borderRadius: {
      ...createTwConfigValues(0, 50, 2),
      DEFAULT: '16px',
      full: '9999px',
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops) 50% 50%)',
    },
    dropShadow: {
      '3xl': '0 13px 13px rgb(0 0 0 / 0.05)',
    },
    fontFamily: {
      text: ['Rubik', 'sans-serif'],
      title: ['Rubik', 'sans-serif'],
      sans: ['Rubik', 'sans-serif'],
    },
    fontSize: {
      10: ['0.625rem', { lineHeight: '0.875rem' }],
      12: ['0.75rem', { lineHeight: '1rem' }],
      14: ['0.875rem', { lineHeight: '1.25rem' }],
      16: ['1rem', { lineHeight: '1.5rem' }],
      18: ['1.125rem', { lineHeight: '1.75rem' }],
      20: ['1.25rem', { lineHeight: '1.75rem' }],
      24: ['1.5rem', { lineHeight: '2rem' }],
      30: ['1.875rem', { lineHeight: '2.25rem' }],
      36: ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      'weight-100': '100',
      'weight-200': '200',
      'weight-300': '300',
      'weight-400': '400',
      'weight-500': '500',
      'weight-600': '600',
      'weight-700': '700',
      'weight-800': '800',
      'weight-900': '900',
    },
    keyframes: {
      spin: {
        to: {
          transform: 'rotate(360deg)',
        },
      },
      ping: {
        '75%, 100%': {
          transform: 'scale(2)',
          opacity: '0',
        },
      },
      pulse: {
        '50%': {
          opacity: '.5',
        },
      },
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
        },
        '50%': {
          transform: 'none',
          animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
        },
      },
      fade: {
        from: {
          opacity: '0',
        },
      },
      translateY: {
        from: {
          transform: 'translateY(20px)',
        },
      },
      scale: {
        from: {
          transform: 'scale(0.8)',
        },
      },
    },
    maxWidth: ({ theme, breakpoints }) => ({
      none: 'none',
      0: '0rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
      prose: '65ch',
      ...breakpoints(theme('screens')),
    }),
  },
  plugins: [],
} satisfies Config;
