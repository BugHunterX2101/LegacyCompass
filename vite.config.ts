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
          utils: ['./src/services/aiService', './src/services/performanceService'],
          data: ['./src/services/realTimeLeadService', './src/data/globalCompanies'],
          components: ['./src/components/leads/LeadTable', './src/components/performance/VirtualizedLeadTable']
        },
      },
    },
    chunkSizeWarningLimit: 2000, // Increased for large dataset
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
