// tailwind.config.cjs
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/**/*.svelte', 
    './src/**/*.css'
  ],
  options: {
    safelist: [
      {
        pattern: /data-theme$/,
      }
    ]
  },
  media: false,
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}