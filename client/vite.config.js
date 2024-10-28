import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      // List of dependencies to pre-bundle
    ],
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  client: {
    port: 3000,
  }
});
