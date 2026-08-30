import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node", include: ["packages/sky-webhook-hub/src/**/*.test.ts"] } });
