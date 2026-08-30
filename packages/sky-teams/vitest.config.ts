import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node", include: ["packages/sky-teams/src/**/*.test.ts"] } });
