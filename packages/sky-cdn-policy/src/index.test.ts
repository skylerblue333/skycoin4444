import { describe, expect, it } from "vitest";
import { normalizeCdnPolicy, resolveCdnPolicy } from "./index";

describe("SkyCDNPolicy", () => {
  it("normalizes bounded policy values", () => {
    expect(normalizeCdnPolicy({ id: " p1 ", pathPrefix: "/assets/", cacheControl: "public", ttlSeconds: 60, varyHeaders: ["Accept-Encoding", "accept-encoding"] })).toEqual({
      id: "p1",
      pathPrefix: "/assets",
      cacheControl: "public",
      ttlSeconds: 60,
      varyHeaders: ["accept-encoding"],
    });
  });

  it("selects the longest matching prefix deterministically", () => {
    const resolved = resolveCdnPolicy([
      { id: "root", pathPrefix: "/", cacheControl: "private", ttlSeconds: 0 },
      { id: "assets", pathPrefix: "/assets", cacheControl: "public", ttlSeconds: 60 },
      { id: "img", pathPrefix: "/assets/images", cacheControl: "public, immutable", ttlSeconds: 3600 },
    ], "/assets/images/logo.png");
    expect(resolved?.policyId).toBe("img");
    expect(resolved?.ttlSeconds).toBe(3600);
  });

  it("uses the root policy as a fallback for descendant paths", () => {
    const resolved = resolveCdnPolicy([
      { id: "root", pathPrefix: "/", cacheControl: "private", ttlSeconds: 0 },
    ], "/account/settings");
    expect(resolved?.policyId).toBe("root");
    expect(resolved?.path).toBe("/account/settings");
  });

  it("rejects invalid limits and paths", () => {
    expect(() => normalizeCdnPolicy({ id: "x", pathPrefix: "assets", cacheControl: "public", ttlSeconds: 1 })).toThrow();
    expect(() => resolveCdnPolicy([], "https://example.com/x")).toThrow();
  });
});
