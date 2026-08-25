import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-gradebook/src/**/*.test.ts"],
  },
});
