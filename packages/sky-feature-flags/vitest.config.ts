import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["packages/sky-feature-flags/src/**/*.test.ts"], environment: "node" } });
