/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d6c7ff',
          300: '#b8a0ff',
          400: '#9570ff',
          500: '#4525A2', // Dark Purple
          600: '#3d1f8f',
          700: '#351a7c',
          800: '#2d1569',
          900: '#251056',
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#f9d1e7',
          300: '#f4a5d1',
          400: '#EB5F7A', // Coral/Salmon Pink
          500: '#e91e63',
          600: '#d81b60',
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        },
        secondary: {
          50: '#f8f7ff',
          100: '#f0edff',
          200: '#e4dfff',
          300: '#d1c7ff',
          400: '#A677CA', // Medium Lavender
          500: '#9c6bc7',
          600: '#8e5bb8',
          700: '#7d4aa5',
          800: '#6c3d8f',
          900: '#5a3277',
        },
        tertiary: {
          50: '#f0f0ff',
          100: '#e6e6ff',
          200: '#d1d1ff',
          300: '#ABA7E3', // Light Lavender/Periwinkle
          400: '#9b97e0',
          500: '#8b87dd',
          600: '#7b77d9',
          700: '#6b67d5',
          800: '#5b57d1',
          900: '#4b47cd',
        },
        dark: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#f9d1e7',
          300: '#f4a5d1',
          400: '#890C50', // Deep Magenta/Burgundy
          500: '#7a0b47',
          600: '#6b0a3e',
          700: '#5c0935',
          800: '#4d082c',
          900: '#3e0723',
        },
        background: '#F9FAFB',
        text: '#1E1E1E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4525A2 0%, #A677CA 50%, #EB5F7A 100%)',
        'gradient-hero': 'linear-gradient(135deg, #4525A2 0%, #A677CA 25%, #ABA7E3 50%, #890C50 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #A677CA 0%, #ABA7E3 100%)',
        'gradient-accent': 'linear-gradient(135deg, #EB5F7A 0%, #890C50 100%)',
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
