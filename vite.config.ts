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
          heroicons: ['@heroicons/react/24/outline'],
          lucide: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  
  // Development optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', '@heroicons/react/24/outline', 'lucide-react'],
  },
  
  // Enable source maps in development
  css: {
    devSourcemap: mode === 'development',
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Define global constants
  define: {
    __DEV__: mode === 'development',
  },
}));