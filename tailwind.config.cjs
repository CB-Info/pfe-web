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
      borderColor: {
        "blue-sky": "#DFEAF2"
      },
      textColor: {
        "textfield-color": "#718EBF"
      },
      fontFamily: {
        'lufga': ['Lufga', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
}

