import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-search/src/**/*.test.ts"],
    environment: "node",
  },
});
