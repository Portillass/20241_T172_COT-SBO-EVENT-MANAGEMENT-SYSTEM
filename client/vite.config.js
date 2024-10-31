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
