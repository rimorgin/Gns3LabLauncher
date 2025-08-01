import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

const mode = process.env.NODE_ENV;

// https://vitejs.dev/config/
export default defineConfig(() => {
  //console.log(`[VITE] Running in mode: ${mode}`);
  const outDir =
    mode === "staging"
      ? "src/client/dist/staging/"
      : "src/client/dist/production/";

  return {
    plugins: [react(), tailwindcss(), VitePWA({ registerType: "autoUpdate" })],
    root: process.cwd(),
    base: "/",
    build: {
      outDir: outDir,
      sourcemap: false,
      minify: "esbuild" as const,
      chunkSizeWarningLimit: 2000,
      /* rollupOptions: {
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
      }, */
    },
    esbuild: {
      drop:
        mode === "production"
          ? (["console", "debugger"] as ("console" | "debugger")[])
          : [],
      //remove console.log and keep console.error
      //pure: mode === "production" ? ["console.log"] : [],
    },
    server: {
      allowedHosts: [
        "gns3lablauncher.mapua.netlab",
        "adb3f906b4e6.ngrok-free.app",
        "gns3.loca.lt",
      ],
    },
    resolve: {
      alias: {
        "@clnt": path.resolve(__dirname, "./src/client"),
      },
    },
  };
});
