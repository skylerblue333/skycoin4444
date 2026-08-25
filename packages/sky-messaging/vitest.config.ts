import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-messaging/src/**/*.test.ts"],
  },
});
