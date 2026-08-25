import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["packages/sky-evaluation/src/**/*.test.ts"], environment: "node" } });
