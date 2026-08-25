import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-catalog/src/**/*.test.ts"],
  },
});
