import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

// Load environment variables from `.env` file
dotenv.config();

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: process.env.VITE_FRONTEND_SERVER_HOST || "0.0.0.0", // Default to '0.0.0.0' if not set
    port: parseInt(process.env.VITE_FRONTEND_SERVER_PORT || "3000", 10), // Default to 3000 if not set

    // ✅ Proxy setup to avoid mixed content issues
    proxy: {
      "/api": {
        target: process.env.VITE_SERVER_BACKEND_DOMAIN, // Ensure it matches the backend domain
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
