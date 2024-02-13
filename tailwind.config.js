/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        "primary-orange": "#F5801E"
      },
      textColor: {
        "primary-orange": "#F5801E"
      },
      fontFamily: {
        'lufga': ['Lufga', 'sans-serif'],
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
}

