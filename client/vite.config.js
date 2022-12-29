import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:5000",
      "/images": "http://localhost:5000",
    },
  },
});
