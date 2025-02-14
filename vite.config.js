import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // Removed Tailwind CSS plugin
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
