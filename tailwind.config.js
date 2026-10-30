/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        archival: {
          darkest: '#0E100D',
          sidebar: '#11130F',
          black: '#171915',
          borderDark: '#2B2E27',
          borderMutedDark: '#3A3E34',
          paper: '#E9E5D8',
          paperSecondary: '#DCD8CB',
          paperLight: '#F3EFE4',
          paperCard: '#DFDBD0',
          paperHover: '#E1DDCF',
          border: '#AAA99B',
          borderLight: '#C2C0B2',
          text: '#25251F',
          textSecondary: '#66655A',
          textMuted: '#77766B',
          textSubtle: '#8C8B7E',
          olive: '#777A5A',
          green: '#738A62',
          chart: '#77796C',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
        serif: ['"Cormorant Garamond"', '"Newsreader"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        '3xs': '0.5625rem', // 9px
        '4xs': '0.5rem', // 8px
      }
    },
  },
  plugins: [],
}

