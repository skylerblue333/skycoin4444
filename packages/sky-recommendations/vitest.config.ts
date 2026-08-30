import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["packages/sky-recommendations/**/*.test.ts"],
  },
});
