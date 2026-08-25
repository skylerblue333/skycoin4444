import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-sessions/src/**/*.test.ts"],
  },
});
