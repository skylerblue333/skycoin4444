import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["packages/sky-fraud-signals/src/**/*.test.ts"], environment: "node" } });
