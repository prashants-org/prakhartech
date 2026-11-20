import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  build: isSsrBuild
    ? { outDir: "dist-ssr", copyPublicDir: false }
    : {
        // manifest lets scripts/prerender.mjs link each page's CSS and JS chunk
        manifest: true,
        rollupOptions: {
          input: {
            main: fileURLToPath(new URL("./index.html", import.meta.url)),
            // Staff letter system: a separate app at /letters/, not prerendered
            letters: fileURLToPath(new URL("./letters/index.html", import.meta.url)),
          },
        },
      },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setupTests.js",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: ["src/**/*"],
      exclude: ["src/main.jsx", "src/entry-server.jsx", "src/**/*.d.ts"],
    },
  },
}));
