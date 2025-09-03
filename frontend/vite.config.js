import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite accesos desde cualquier IP
    port: 5173,       // Asegura que sigue usando el puerto 5173
    strictPort: true, // Evita que cambie de puerto si 5173 está ocupado
  }
});
*/
