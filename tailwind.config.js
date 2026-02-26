/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#64748B',
        footer: '#0a1f3d',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // ← Tambahkan ini
  ],
}
