import { describe, expect, it } from "vitest";
import {
  evaluatePlacement,
  orderTotalMinor,
  transitionOrder,
  validateAvailability,
  validateOrder,
} from "./index";

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

  it("rejects malformed orders without dereferencing them", () => {
    expect(
      validateOrder(null as unknown as typeof order),
    ).toEqual(["order is required"]);

    expect(
      evaluatePlacement(
        null as unknown as typeof order,
        [],
      ),
    ).toEqual({
      accepted: false,
      reason: "order is required",
      totalMinor: 0,
      shortages: [],
    });
  });

  it("rejects malformed order lines", () => {
    expect(
      validateOrder({
        ...order,
        lines: [null as unknown as (typeof order.lines)[number]],
      }),
    ).toContain("order line is required at index 0");

    expect(
      validateOrder({
        ...order,
        lines: [
          {
            sku: null as unknown as string,
            quantity: 1,
            unitPriceMinor: 100,
          },
        ],
      }),
    ).toContain("sku is required");
  });

  it("rejects invalid numeric lines in direct total calculation", () => {
    expect(() =>
      orderTotalMinor({
        ...order,
        lines: [{ sku: "sku-a", quantity: 0.5, unitPriceMinor: 2 }],
      }),
    ).toThrow("quantity must be positive for sku-a");
  });

  it("accepts placement when inventory is sufficient", () => {
    expect(
      evaluatePlacement(order, [
        { sku: "sku-a", available: 2 },
        { sku: "sku-b", available: 3 },
      ]),
    ).toEqual({ accepted: true, totalMinor: 1250, shortages: [] });
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

  it("rejects malformed availability snapshots", () => {
    expect(
      validateAvailability(
        null as unknown as Array<{ sku: string; available: number }>,
      ),
    ).toEqual(["availability must be an array"]);

    expect(
      validateAvailability([
        null as unknown as { sku: string; available: number },
      ]),
    ).toContain("availability item is required at index 0");
  });

  it("rejects invalid inventory availability before placement", () => {
    const decision = evaluatePlacement(order, [
      { sku: "sku-a", available: Number.NaN },
      { sku: "sku-b", available: 3 },
    ]);

    expect(decision.accepted).toBe(false);
    expect(decision.reason).toContain(
      "availability must be a non-negative safe integer for sku-a",
    );
  });

  it("rejects duplicate inventory availability rows", () => {
    expect(
      validateAvailability([
        { sku: "sku-a", available: 2 },
        { sku: "sku-a", available: 3 },
      ]),
    ).toContain("duplicate availability sku: sku-a");
  });

  it("rejects unsafe aggregate quantities for duplicate SKUs", () => {
    const errors = validateOrder({
      ...order,
      lines: [
        {
          sku: "sku-a",
          quantity: Number.MAX_SAFE_INTEGER,
          unitPriceMinor: 0,
        },
        { sku: "sku-a", quantity: 2, unitPriceMinor: 0 },
      ],
    });

    expect(errors).toContain(
      "total quantity exceeds safe integer range for sku-a",
    );
  });

  it("enforces lifecycle transitions", () => {
    expect(transitionOrder(order, "placed").status).toBe("placed");
    expect(() =>
      transitionOrder({ ...order, status: "cancelled" }, "placed"),
    ).toThrow("invalid order transition");
    expect(() =>
      transitionOrder(
        { ...order, status: "unknown" as "draft" },
        "placed",
      ),
    ).toThrow("invalid current order status: unknown");
    expect(() =>
      transitionOrder(
        null as unknown as typeof order,
        "placed",
      ),
    ).toThrow("order is required");
  });

  it("validates currency and line invariants", () => {
    expect(validateOrder({ ...order, currency: "usd", lines: [] })).toEqual([
      "currency must be a 3-letter uppercase code",
      "at least one order line is required",
    ]);
  });
});
