import { build } from "esbuild";
import { describe, expect, it } from "vitest";

describe("production server bundle boundary", () => {
  it("keeps Vite and Vite config out of the production server bundle", async () => {
    const result = await build({
      entryPoints: ["server/_core/index.ts"],
      platform: "node",
      packages: "external",
      bundle: true,
      format: "esm",
      write: false,
      logLevel: "silent",
    });

    const output = result.outputFiles
      .map(file => file.text)
      .join("\n");

    expect(output).not.toMatch(/from\s+["']vite["']/);
    expect(output).not.toContain("vite.config");
    expect(output).toContain('const developmentServerModule = "./vite"');
  });
});
