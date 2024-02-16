/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        "primary-color": "#3C7FD0"
      },
      textColor: {
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

