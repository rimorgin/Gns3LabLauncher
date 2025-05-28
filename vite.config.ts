import { defineConfig } from "vite";
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react";
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: process.cwd(),
  base: "/", 
  build: { 
    outDir: "src/client/dist" 
  },
  resolve: {
    alias: {
      "@clnt": path.resolve(__dirname, "./src/client"),
    },
  }
});
