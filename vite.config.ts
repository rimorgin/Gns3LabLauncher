import { defineConfig } from "vite";
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      "@clnt": path.resolve(__dirname, "./src/client"),
    },
  },
});
