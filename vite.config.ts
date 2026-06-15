import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  // Performance optimizations
  build: {
    target: 'es2015',
    minify: 'esbuild',
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
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
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
  
  // Drop console/debugger in production
  esbuild: mode === 'production' ? {
    drop: ['console', 'debugger'],
  } : undefined,
  
  // Define global constants
  define: {
    __DEV__: mode === 'development',
  },
}));