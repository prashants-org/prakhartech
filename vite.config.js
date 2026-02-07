import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
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
      exclude: ["src/main.jsx", "src/main.tsx", "src/**/*.d.ts"],
    },
  },
});
