import { describe, expect, it } from "vitest";
import { createReturnDecision, normalizeReturnRequest, transitionReturn } from "./index";

describe("SkyReturns", () => {
  it("normalizes requests with requested status", () => {
    expect(normalizeReturnRequest({ id: " r1 ", orderId: " o1 ", itemId: " i1 ", quantity: 2, reason: " damaged " })).toEqual({
      id: "r1",
      orderId: "o1",
      itemId: "i1",
      quantity: 2,
      reason: "damaged",
      status: "requested",
    });
  });

  it("rejects unknown lifecycle states from untyped inputs", () => {
    const unsafe = { id: "r1", orderId: "o1", itemId: "i1", quantity: 1, reason: "damaged", status: "cancelled" } as unknown as Parameters<typeof normalizeReturnRequest>[0];
    expect(() => normalizeReturnRequest(unsafe)).toThrow(/status must be one of/);
  });

  it("enforces deterministic lifecycle transitions", () => {
    const approved = transitionReturn({ id: "r1", orderId: "o1", itemId: "i1", quantity: 1, reason: "wrong size" }, "approved");
    expect(approved.status).toBe("approved");
    expect(() => transitionReturn(approved, "refunded")).toThrow(/invalid return transition/);
  });

  it("emits versioned decisions only for requested returns", () => {
    const input = { id: "r1", orderId: "o1", itemId: "i1", quantity: 1, reason: "damaged" };
    expect(createReturnDecision(input, true)).toEqual({ type: "sky.returns.decision.v1", returnId: "r1", status: "approved" });
    expect(() => createReturnDecision(input, false)).toThrow(/rejection reason/);
    expect(() => createReturnDecision({ ...input, status: "rejected" }, true)).toThrow(/requested status/);
  });
});
