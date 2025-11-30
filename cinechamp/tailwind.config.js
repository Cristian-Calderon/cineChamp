export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Paleta Midnight Blue - Elegante y Premium
          cinechamp: {
            // Fondos
            bg: {
              primary: '#0d1b2a',      // Azul marino profundo
              secondary: '#1b263b',    // Azul marino
              tertiary: '#1e3a5f',     // Azul medio oscuro
              elevated: '#2c4875',     // Azul elevado
              hover: '#3a5a8f',        // Hover azul
            },
            // Accent colors
            accent: {
              primary: '#4fc3f7',      // Azul cielo brillante
              secondary: '#26c6da',    // Cyan vibrante
              tertiary: '#4dd0e1',     // Verde agua
              success: '#26a69a',      // Verde azulado
              error: '#ef5350',        // Rojo suave
              warning: '#ffa726',      // Naranja suave
            },
            // Texto
            text: {
              primary: '#e3f2fd',      // Blanco azulado
              secondary: '#b0bec5',    // Gris azulado claro
              tertiary: '#78909c',     // Gris azulado medio
              disabled: '#546e7a',     // Gris azulado oscuro
            },
            // Bordes
            border: {
              primary: '#2c4875',      // Borde azul oscuro
              secondary: '#1e3a5f',    // Borde azul muy oscuro
              accent: '#4fc3f7',       // Borde azul brillante
            }
          }
        },
        backgroundImage: {
          'gradient-dark': 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
          'gradient-accent': 'linear-gradient(135deg, #4fc3f7 0%, #26c6da 100%)',
          'gradient-warm': 'linear-gradient(135deg, #4dd0e1 0%, #26a69a 100%)',
          'gradient-mesh': 'radial-gradient(at 50% 0%, rgba(79, 195, 247, 0.12), transparent 50%), radial-gradient(at 80% 50%, rgba(38, 198, 218, 0.08), transparent 50%)',
          'glass': 'linear-gradient(135deg, rgba(79, 195, 247, 0.08) 0%, rgba(38, 198, 218, 0.04) 100%)',
        },
        backdropBlur: {
          xs: '2px',
        },
        boxShadow: {
          'glow-accent': '0 0 30px rgba(79, 195, 247, 0.4)',
          'glow-cyan': '0 0 30px rgba(38, 198, 218, 0.4)',
          'glow-warm': '0 0 30px rgba(77, 208, 225, 0.4)',
          'inner-glow': 'inset 0 0 20px rgba(79, 195, 247, 0.15)',
          'card': '0 8px 32px rgba(13, 27, 42, 0.6)',
          'card-hover': '0 12px 48px rgba(13, 27, 42, 0.8)',
        },
        animation: {
          'fade-in': 'fadeIn 0.4s ease-out',
          'slide-up': 'slideUp 0.5s ease-out',
          'slide-down': 'slideDown 0.5s ease-out',
          'slide-left': 'slideLeft 0.5s ease-out',
          'slide-right': 'slideRight 0.5s ease-out',
          'scale-in': 'scaleIn 0.3s ease-out',
          'shimmer': 'shimmer 2s linear infinite',
          'float': 'float 3s ease-in-out infinite',
          'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(30px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          slideDown: {
            '0%': { transform: 'translateY(-30px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          slideLeft: {
            '0%': { transform: 'translateX(30px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          slideRight: {
            '0%': { transform: 'translateX(-30px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          scaleIn: {
            '0%': { transform: 'scale(0.9)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-1000px 0' },
            '100%': { backgroundPosition: '1000px 0' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          pulseGlow: {
            '0%, 100%': { boxShadow: '0 0 20px rgba(79, 195, 247, 0.4)' },
            '50%': { boxShadow: '0 0 40px rgba(79, 195, 247, 0.7)' },
          },
        },
      },
    },
    plugins: [],
  }
  