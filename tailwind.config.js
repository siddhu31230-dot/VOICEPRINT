/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#08080a',
          secondary: '#0f0f13',
          tertiary: '#15151c',
          card: '#0d0d12',
          surface: '#121218',
        },
        acid: {
          DEFAULT: '#D4FF00',
          hover: '#E5FF4D',
          muted: '#8AA600',
          dim: 'rgba(212, 255, 0, 0.12)',
          glow: 'rgba(212, 255, 0, 0.25)',
        },
        border: {
          subtle: '#1E1E26',
          medium: '#2A2A36',
          bright: 'rgba(212, 255, 0, 0.3)',
        },
        text: {
          primary: '#F4F4F6',
          secondary: '#9D9DAE',
          muted: '#5F5F73',
          accent: '#D4FF00',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        waveBar: {
          '0%': { height: '12%' },
          '100%': { height: '96%' },
        }
      }
    },
  },
  plugins: [],
}
