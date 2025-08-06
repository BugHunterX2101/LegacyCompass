import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  // Performance optimizations
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ai: ['./src/services/aiService.ts'],
          performance: ['./src/services/performanceService.ts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  // Development optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom'],
  },
  
  // Enable source maps in development
  css: {
    devSourcemap: mode === 'development',
  },
}));
