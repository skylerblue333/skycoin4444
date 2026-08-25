import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-scheduler/src/**/*.test.ts"],
  },
});
