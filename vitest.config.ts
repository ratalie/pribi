import { defineConfig } from "vitest/config";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // ⭐ Permitir que MSW funcione en Node.js
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/",
        "**/.nuxt/",
      ],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
      "@": resolve(__dirname, "./app"),
      "@hexag": resolve(__dirname, "./app/core/hexag"),
      "@hexag/registros/shared": resolve(__dirname, "./app/core/hexag/registros/shared"),
      "~/tests": resolve(__dirname, "./tests"),
      "@tests": resolve(__dirname, "./tests"),
    },
  },
});
