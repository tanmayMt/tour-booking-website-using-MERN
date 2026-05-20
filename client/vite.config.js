import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'axios'], // Separate vendor libraries
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: Adjust the warning limit (in kB)
  },
});
