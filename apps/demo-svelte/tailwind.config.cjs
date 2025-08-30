// tailwind.config.cjs
module.exports = {
  content: ["./src/**/*.{html,svelte,ts,js}", "./src/app.html"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'cupcake']
  }
}