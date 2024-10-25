/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minHeight: {
        'screen-mh': 'calc(100vh - 3rem)'
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
      }
    }
  },
  plugins: []
}
