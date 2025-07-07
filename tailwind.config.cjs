/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        "primary-color": "#3C7FD0",
        "bg-color": "#F8F9FA"
      },
      placeholderColor: {
        "primary-color": "#718EBF"
      },
      borderColor: {
        "primary-color": "#DFEAF2"
      },
      fontFamily: {
        'lufga': ['Lufga', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      screens: {
        'xs': '475px',
      }
    },
  },
  plugins: [
    require("daisyui"),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-slate-600': {
          'scrollbar-color': '#475569 transparent',
        },
        '.scrollbar-track-slate-700': {
          'scrollbar-color': '#475569 #334155',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

