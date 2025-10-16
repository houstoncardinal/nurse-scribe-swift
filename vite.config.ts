import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable cache busting with content hashes
    rollupOptions: {
      output: {
        // Add version to chunk names for cache busting
        chunkFileNames: (chunkInfo) => {
          return `assets/[name]-v1.4.8-${Date.now()}-[hash].js`;
        },
        entryFileNames: (chunkInfo) => {
          return `assets/[name]-v1.4.8-${Date.now()}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
            return `assets/images/[name]-v1.4.8-${Date.now()}-[hash].[ext]`;
          }
          if (/css/i.test(extType ?? '')) {
            return `assets/css/[name]-v1.4.8-${Date.now()}-[hash].[ext]`;
          }
          return `assets/[name]-v1.4.8-${Date.now()}-[hash].[ext]`;
        },
      },
    },
    // Generate manifest for cache busting
    manifest: true,
    // Ensure proper source maps for debugging
    sourcemap: mode === "development",
  },
  // Add cache busting for development
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
}));
