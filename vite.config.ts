import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssTarget: "chrome100",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@react-oauth")) return "google-oauth";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("react-dom") || id.includes("react/")) return "react";
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
});
