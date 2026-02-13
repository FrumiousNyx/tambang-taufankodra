import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimized build configuration
    target: 'esnext',
    minify: 'esbuild', // Use esbuild instead of terser for faster builds
    rollupOptions: {
      output: {
        // Simplified code splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-toast', 'sonner'],
          utils: ['clsx', 'tailwind-merge'],
        },
      },
    },
    // Reduce chunk size warning
    chunkSizeWarningLimit: 800,
    // Enable source maps for development
    sourcemap: mode === 'development',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-i18next',
      'i18next',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      'sonner',
      'clsx',
      'tailwind-merge',
    ],
  },
}));
