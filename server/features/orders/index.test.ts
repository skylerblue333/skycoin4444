import { describe, expect, it } from "vitest";
import { evaluatePlacement, orderTotalMinor, transitionOrder, validateOrder } from "./index";

const order = {
  id: "ord-1",
  currency: "USD",
  status: "draft" as const,
  lines: [
    { sku: "sku-a", quantity: 2, unitPriceMinor: 500 },
    { sku: "sku-b", quantity: 1, unitPriceMinor: 250 },
  ],
};

describe("SkyOrders", () => {
  it("computes totals using minor units", () => {
    expect(orderTotalMinor(order)).toBe(1250);
  });

  it("accepts placement when inventory is sufficient", () => {
    expect(evaluatePlacement(order, [
      { sku: "sku-a", available: 2 },
      { sku: "sku-b", available: 3 },
    ])).toEqual({ accepted: true, totalMinor: 1250, shortages: [] });
  });

  it("reports deterministic shortages", () => {
    expect(evaluatePlacement(order, [{ sku: "sku-a", available: 1 }])).toEqual({
      accepted: false,
      reason: "inventory-shortage",
      totalMinor: 1250,
      shortages: [
        { sku: "sku-a", requested: 2, available: 1 },
        { sku: "sku-b", requested: 1, available: 0 },
      ],
    });
  });

  it("enforces lifecycle transitions", () => {
    expect(transitionOrder(order, "placed").status).toBe("placed");
    expect(() => transitionOrder({ ...order, status: "cancelled" }, "placed")).toThrow("invalid order transition");
  });

  it("validates currency and line invariants", () => {
    expect(validateOrder({ ...order, currency: "usd", lines: [] })).toEqual([
      "currency must be a 3-letter uppercase code",
      "at least one order line is required",
    ]);
  });
});
