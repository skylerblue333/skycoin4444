import { describe, expect, it } from "vitest";
import { SkySdkRegistry } from "./index";

describe("SkySdkRegistry", () => {
  it("normalizes and snapshots SDK metadata deterministically", () => {
    const registry = new SkySdkRegistry();
    registry.register({ id: " sdk-b ", language: " TypeScript ", packageName: "@sky/sdk", version: "1.2.3", documentationUrl: "https://docs.example/sdk" });
    registry.register({ id: "sdk-a", language: "Python", packageName: "sky-sdk", version: "0.9.0" });
    expect(registry.snapshot()).toEqual({
      type: "sky.sdk-registry.snapshot.v1",
      sdkCount: 2,
      sdks: [
        { id: "sdk-a", language: "python", packageName: "sky-sdk", version: "0.9.0" },
        { id: "sdk-b", language: "typescript", packageName: "@sky/sdk", version: "1.2.3", documentationUrl: "https://docs.example/sdk" },
      ],
    });
  });

  it("rejects duplicate IDs and unsafe metadata", () => {
    const registry = new SkySdkRegistry();
    registry.register({ id: "sdk-a", language: "go", packageName: "sky", version: "1.0.0" });
    expect(() => registry.register({ id: "sdk-a", language: "rust", packageName: "sky2", version: "1.0.0" })).toThrow("duplicate sdk id: sdk-a");
    expect(() => new SkySdkRegistry().register({ id: "bad", language: "go", packageName: "bad", version: "latest" })).toThrow("version must be semver-like");
    expect(() => new SkySdkRegistry().register({ id: "bad", language: "go", packageName: "bad", version: "1.0.0", documentationUrl: "http://example.com" })).toThrow("documentation URL must use https");
  });
});
