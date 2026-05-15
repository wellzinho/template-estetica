import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0e0e0e',
          soft: '#131313',
          raised: '#161616',
          card: '#1a1a1a',
          panel: '#1c1b1b',
          quote: '#201f1f',
        },
        gold: {
          DEFAULT: '#e6c364',
          muted: '#c9a84c',
          wash: 'rgba(201, 168, 76, 0.2)',
          line: 'rgba(230, 195, 100, 0.2)',
        },
        mist: '#d0c5b2',
        marble: '#e5e2e1',
        cocoa: '#3d2e00',
        cocoaSoft: '#503d00',
        rule: '#4d4637',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        label: '0.175em',
        kicker: '0.2em',
      },
      boxShadow: {
        lift: '0px 25px 50px -12px rgba(0,0,0,0.25)',
      },
      transitionTimingFunction: {
        outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'testimonials-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'testimonials-marquee': 'testimonials-marquee 42s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
