import { defineConfig } from "vitest/config";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  test: {
    coverage: {
      provider: "v8", // or 'istanbul'
    },
    env: {
      VITE_DATABASE_URL: "memory://",
    },
  },
});
