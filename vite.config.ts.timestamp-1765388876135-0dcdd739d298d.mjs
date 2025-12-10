// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [react()],
  // Performance optimizations
  build: {
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production"
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          heroicons: ["@heroicons/react/24/outline"],
          lucide: ["lucide-react"]
        }
      }
    },
    chunkSizeWarningLimit: 2e3
  },
  // Development optimizations
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@heroicons/react/24/outline", "lucide-react"]
  },
  // Enable source maps in development
  css: {
    devSourcemap: mode === "development"
  },
  // Resolve configuration
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  // Define global constants
  define: {
    __DEV__: mode === "development"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgXG4gIC8vIFBlcmZvcm1hbmNlIG9wdGltaXphdGlvbnNcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiBtb2RlID09PSAncHJvZHVjdGlvbicsXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIGhlcm9pY29uczogWydAaGVyb2ljb25zL3JlYWN0LzI0L291dGxpbmUnXSxcbiAgICAgICAgICBsdWNpZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxuICB9LFxuICBcbiAgLy8gRGV2ZWxvcG1lbnQgb3B0aW1pemF0aW9uc1xuICBzZXJ2ZXI6IHtcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdAaGVyb2ljb25zL3JlYWN0LzI0L291dGxpbmUnLCAnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIFxuICAvLyBFbmFibGUgc291cmNlIG1hcHMgaW4gZGV2ZWxvcG1lbnRcbiAgY3NzOiB7XG4gICAgZGV2U291cmNlbWFwOiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnLFxuICB9LFxuICBcbiAgLy8gUmVzb2x2ZSBjb25maWd1cmF0aW9uXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiAnL3NyYycsXG4gICAgfSxcbiAgfSxcbiAgXG4gIC8vIERlZmluZSBnbG9iYWwgY29uc3RhbnRzXG4gIGRlZmluZToge1xuICAgIF9fREVWX186IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXG4gIH0sXG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUE7QUFBQSxFQUdqQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjLFNBQVM7QUFBQSxRQUN2QixlQUFlLFNBQVM7QUFBQSxNQUMxQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixXQUFXLENBQUMsNkJBQTZCO0FBQUEsVUFDekMsUUFBUSxDQUFDLGNBQWM7QUFBQSxRQUN6QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsK0JBQStCLGNBQWM7QUFBQSxFQUMvRTtBQUFBO0FBQUEsRUFHQSxLQUFLO0FBQUEsSUFDSCxjQUFjLFNBQVM7QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFHQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsUUFBUTtBQUFBLElBQ04sU0FBUyxTQUFTO0FBQUEsRUFDcEI7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
