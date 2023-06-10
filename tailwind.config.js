const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'min-h-[360px]',
  ],
  theme: {
    colors: {
      lightergray: "#FDFDFD",
      lightgray: "#F2F2F2",
      gray: "#D9D9D9",
      darkgray: "#B6B6B6",
      skyblue: "#3284FF",
      blue: "#4758F5",
      black: colors.black,
      blurwhite: '#F9FBFC',
      white: colors.white,
      emerald: colors.emerald,
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      transparent: colors.transparent,
    },
  },
}

