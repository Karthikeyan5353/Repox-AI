/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08111f',
        panel: '#0d1728',
        panel2: '#111f35',
        accent: '#f97316',
        cyan: '#22d3ee',
        line: 'rgba(148,163,184,0.16)',
      },
      boxShadow: {
        panel: '0 24px 70px rgba(2, 8, 23, 0.35)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
        body: ['IBM Plex Sans', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
