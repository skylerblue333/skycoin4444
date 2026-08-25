import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/sky-invoices/src/**/*.test.ts"],
  },
});
