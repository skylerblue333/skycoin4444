import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  assertStaticAssetBundle,
  resolveStaticAssetBundle,
  type StaticAssetBundle,
} from "./staticAssets";

describe("static asset bundle resolution", () => {
  it("resolves the bundled production public directory beside the server bundle", () => {
    const moduleDir = path.resolve("/srv/skycoin/dist");

    expect(
      resolveStaticAssetBundle(
        { NODE_ENV: "production" } as NodeJS.ProcessEnv,
        moduleDir
      )
    ).toEqual({
      distPath: path.resolve(moduleDir, "public"),
      indexPath: path.resolve(moduleDir, "public", "index.html"),
    });
  });

  it("resolves the development build directory from the source module", () => {
    const moduleDir = path.resolve("/srv/skycoin/server/_core");

    expect(
      resolveStaticAssetBundle(
        { NODE_ENV: "development" } as NodeJS.ProcessEnv,
        moduleDir
      )
    ).toEqual({
      distPath: path.resolve("/srv/skycoin/dist/public"),
      indexPath: path.resolve("/srv/skycoin/dist/public/index.html"),
    });
  });
});

describe("static asset startup gate", () => {
  const bundle: StaticAssetBundle = {
    distPath: "/srv/skycoin/dist/public",
    indexPath: "/srv/skycoin/dist/public/index.html",
  };

  it("accepts a complete production bundle", () => {
    const exists = vi.fn(() => true);

    expect(() =>
      assertStaticAssetBundle(
        bundle,
        { NODE_ENV: "production" } as NodeJS.ProcessEnv,
        exists
      )
    ).not.toThrow();
    expect(exists).toHaveBeenCalledTimes(2);
  });

  it("fails production startup when the SPA entrypoint is missing", () => {
    const exists = (filePath: string) => filePath === bundle.distPath;

    expect(() =>
      assertStaticAssetBundle(
        bundle,
        { NODE_ENV: "production" } as NodeJS.ProcessEnv,
        exists
      )
    ).toThrow(/index\.html/);
  });

  it("keeps non-production diagnostics non-fatal", () => {
    const logError = vi.fn();

    expect(() =>
      assertStaticAssetBundle(
        bundle,
        { NODE_ENV: "development" } as NodeJS.ProcessEnv,
        () => false,
        logError
      )
    ).not.toThrow();

    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError.mock.calls[0]?.[0]).toContain("Static asset bundle is incomplete");
  });
});
