import {defineConfig} from "vitest/config";export default defineConfig({test:{include:["packages/sky-storage/src/**/*.test.ts"],environment:"node"}});
