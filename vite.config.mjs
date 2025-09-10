import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    ui: true, // enable Vitest UI
    coverage: {
      provider: "istanbul", // use istanbul provider
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      all: true,
      include: ["src/**/*.{js,jsx}"],
      exclude: ["node_modules/", "src/setupTests.js"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
  },
});
