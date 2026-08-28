import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-returns/src/**/*.test.ts"],
    environment: "node",
  },
});
