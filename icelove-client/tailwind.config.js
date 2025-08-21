/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          "pink" : "#f47dbb",
          "red" : "#ff6868",
          "secondary" : "#555",
          "primaryBG" : "#fcfcfc"
        }


    },
  },
  plugins: [require('daisyui'),],
}

