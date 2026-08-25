import { describe, expect, it } from "vitest";
import { canTransitionFulfillment, totalUnits, validateFulfillmentPlan } from "./index";

describe("SkyFulfillment", () => {
  const plan = { id: "f1", orderId: "o1", status: "planned" as const, items: [{ sku: "A", quantity: 2 }, { sku: "B", quantity: 1 }] };
  it("validates plans and totals units", () => { expect(validateFulfillmentPlan(plan).items).toHaveLength(2); expect(totalUnits(plan)).toBe(3); });
  it("enforces deterministic lifecycle transitions", () => { expect(canTransitionFulfillment("planned", "allocated")).toBe(true); expect(canTransitionFulfillment("shipped", "planned")).toBe(false); });
  it("rejects invalid quantities", () => expect(() => validateFulfillmentPlan({ ...plan, items: [{ sku: "A", quantity: 0 }] })).toThrow());
});
