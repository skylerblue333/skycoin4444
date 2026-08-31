import { describe, expect, it } from "vitest";
import { assignVariant } from "./index";

const variants = [
  { key: "control", weight: 50 },
  { key: "treatment", weight: 50 },
];

describe("SkyExperimentation", () => {
  it("assigns the same subject deterministically", () => {
    expect(assignVariant("checkout-v2", "user:42", variants)).toBe(assignVariant("checkout-v2", "user:42", variants));
  });

  it("returns only configured variants", () => {
    expect(["control", "treatment"]).toContain(assignVariant("checkout-v2", "user:99", variants));
  });

  it("rejects invalid weights", () => {
    expect(() => assignVariant("checkout-v2", "user:42", [{ key: "bad", weight: 0 }])).toThrow("invalid variant weight");
  });
});
