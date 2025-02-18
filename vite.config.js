import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspect from 'vite-plugin-inspect';


export default defineConfig({
  plugins: [react(),Inspect()], // Removed Tailwind CSS plugin
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://menu-backend-rnpu.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
