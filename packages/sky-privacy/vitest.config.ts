import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["packages/sky-privacy/src/**/*.test.ts"], environment: "node" },
});
