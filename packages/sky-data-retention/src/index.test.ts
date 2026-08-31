import { describe, expect, it } from "vitest";
import { shouldRetain } from "./index";

const policy = { category: "audit", retainForMs: 1_000 };

describe("SkyDataRetention", () => {
  it("retains records inside the policy window", () => {
    expect(shouldRetain({ category: "audit", createdAtMs: 9_500 }, policy, 10_000)).toBe(true);
    expect(shouldRetain({ category: "audit", createdAtMs: 9_000 }, policy, 10_000)).toBe(false);
  });

  it("honors explicit legal holds", () => {
    expect(shouldRetain({ category: "audit", createdAtMs: 1, legalHold: true }, policy, 10_000)).toBe(true);
  });

  it("fails closed on mismatched categories", () => {
    expect(() => shouldRetain({ category: "chat", createdAtMs: 1 }, policy, 10_000)).toThrow("category mismatch");
  });
});
