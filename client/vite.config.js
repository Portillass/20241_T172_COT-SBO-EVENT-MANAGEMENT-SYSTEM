<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': 'src', // Updated path alias
    },
  },
  optimizeDeps: {
    include: [
      'react', // Add necessary dependencies here
      'react-dom',
    ],
  },
  build: {
    rollupOptions: {
      input: 'index.html', // Ensure this points to your entry HTML
    },
  },
  server: {
    port: 3000, // Move port configuration under server
  },
});
>>>>>>> fd3adac73c0d8eab1539c56a54cb81a9b42c874f
