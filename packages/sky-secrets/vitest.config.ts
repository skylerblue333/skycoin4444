import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-secrets/src/**/*.test.ts"],
    environment: "node",
  },
});
