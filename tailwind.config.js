/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#FFFDF7',        // Soft ivory page background
        card: '#FFFFFF',        // Pure white cards
        ink: {
          DEFAULT: '#24313A',   // Deep ink text
          light: '#576875',     // Secondary ink text
          subtle: '#899AA8',    // Tertiary/muted ink text
        },
        teal: {
          DEFAULT: '#2A9D8F',   // Teal primary accent
          dark: '#21867A',
          light: '#E6F4F2',
          subtle: '#D1ECE8',
        },
        coral: {
          DEFAULT: '#F28C75',   // Warm coral highlight
          dark: '#E06E55',
          light: '#FDF1EE',
          subtle: '#FCE0D9',
        },
        yellow: {
          DEFAULT: '#F4C95D',   // Soft golden yellow highlight
          dark: '#DBAF40',
          light: '#FEF9EC',
          subtle: '#FCEFCB',
        },
        sky: {
          DEFAULT: '#B9DCE8',   // Pale sky blue supporting accent
          dark: '#89BDD0',
          light: '#F1F7FA',
          subtle: '#E0F0F5',
        },
        border: {
          DEFAULT: '#EBE6DC',   // Warm subtle border
          strong: '#D5CFC2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
