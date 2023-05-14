/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),
  ],
  daisyui: {
    logs: false
  }
}
