import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["packages/sky-tutoring/src/**/*.test.ts"], environment: "node" } });
