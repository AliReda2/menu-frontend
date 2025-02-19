import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [react(), viteCompression()], // Removed Tailwind CSS plugin
  server: {
    proxy: {
      "/api": {
        target: "https://menu-backend-rnpu.onrender.com",
        changeOrigin: true,
        secure: true, // Ensures HTTPS is properly handled
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Removes console logs
        drop_debugger: true, // Removes debugger statements
      },
    },
  },
});
