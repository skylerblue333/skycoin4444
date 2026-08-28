import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-events/src/**/*.test.ts"],
    environment: "node",
  },
});
