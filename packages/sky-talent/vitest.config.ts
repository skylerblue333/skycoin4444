import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-talent/src/**/*.test.ts"],
    environment: "node",
  },
});
