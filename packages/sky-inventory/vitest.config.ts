import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["packages/sky-inventory/src/**/*.test.ts"], environment: "node" } });
