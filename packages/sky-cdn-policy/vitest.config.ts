import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-cdn-policy/src/**/*.test.ts"],
    environment: "node",
  },
});
