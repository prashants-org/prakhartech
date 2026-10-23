import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  build: isSsrBuild
    ? { outDir: "dist-ssr", copyPublicDir: false }
    : // manifest lets scripts/prerender.mjs link each page's CSS and JS chunk
      { manifest: true },
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
