import { describe, expect, it } from "vitest";
import { MemoryCache, stableCacheKey } from "./index";

describe("SkyCache", () => {
  it("stores and expires values deterministically", () => {
    const cache = new MemoryCache<number>();
    cache.set("a", 1, { ttlMs: 100, now: 1000 });
    expect(cache.get("a", 1099)).toBe(1);
    expect(cache.get("a", 1100)).toBeUndefined();
  });
  it("cleans expired values when measuring size", () => {
    const cache = new MemoryCache<string>();
    cache.set("a", "x", { ttlMs: 1, now: 10 });
    cache.set("b", "y", { now: 10 });
    expect(cache.size(11)).toBe(1);
  });
  it("builds stable encoded keys", () => expect(stableCacheKey("jobs", ["a b", 2, true])).toBe("jobs:a%20b:2:true"));
});
