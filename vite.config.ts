import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`[VITE] Running in mode: ${mode}`);
  const outDir =
    mode === "staging"
      ? "src/client/dist/staging/"
      : "src/client/dist/production/";

  return {
    plugins: [react(), tailwindcss()],
    root: process.cwd(),
    base: "/",
    build: {
      outDir: outDir,
      sourcemap: false,
      minify: "esbuild",
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
      //remove console.log and keep console.error
      //pure: mode === "production" ? ["console.log"] : [],
    },
    server: {
      allowedHosts: ["gns3lablauncher.mapua.netlab"],
    },
    resolve: {
      alias: {
        "@clnt": path.resolve(__dirname, "./src/client"),
      },
    },
  };
});
