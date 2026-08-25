import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["packages/sky-donations/src/**/*.test.ts"], environment: "node" },
});
