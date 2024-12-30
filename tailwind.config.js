/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        np: '2052 / 1640'
      },
      minHeight: {
        'screen-mh': 'calc(100vh - 3rem)',
        'screen-mh-kanban': 'calc(100vh - 7.75rem)'
        // 'screen-dvh-mobile': 'calc(100dvh - 4rem)'
      },
      fontSize: {
        fontResp: 'clamp(1.5rem, 2vw, 2rem)'
      },
      animation: {
        fade: 'fadeIn .5s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(90deg, #0000 3%, var(--principal-color) 35%, var(--principal-color) 65%, #0000 97%)'
      }
    }
  },
  plugins: []
}
