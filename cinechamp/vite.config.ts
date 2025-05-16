import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';



//Vite no sabe que tiene que redirigir eso al backend en localhost:3001, y por eso la solicitud no llega o se va a un endpoint incorrecto 
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
