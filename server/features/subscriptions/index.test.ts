import { describe, expect, it } from "vitest";
import {
  recurringAmountMinor,
  requestPeriodEndCancellation,
  toSubscriptionIntent,
  transitionSubscription,
  validatePlan,
  validateSubscription,
} from "./index";

const plan = { id: "pro", interval: "month" as const, priceMinor: 1200, currency: "USD" };
const subscription = {
  id: "sub-1",
  customerId: "cus-1",
  planId: "pro",
  status: "active" as const,
  quantity: 2,
  currentPeriodStart: "2026-08-01T00:00:00.000Z",
  currentPeriodEnd: "2026-09-01T00:00:00.000Z",
  cancelAtPeriodEnd: false,
};

describe("SkySubscriptions", () => {
  it("computes recurring amounts in integer minor units", () => {
    expect(recurringAmountMinor(plan, 2)).toBe(2400);
  });

  it("enforces lifecycle transitions", () => {
    expect(transitionSubscription(subscription, "paused").status).toBe("paused");
    expect(() => transitionSubscription({ ...subscription, status: "cancelled" }, "active")).toThrow(
      "invalid subscription transition",
    );
  });

  it("supports period-end cancellation without pretending to execute billing", () => {
    expect(requestPeriodEndCancellation(subscription).cancelAtPeriodEnd).toBe(true);
  });

  it("validates periods, currency, and quantities", () => {
    expect(validatePlan({ ...plan, currency: "usd", priceMinor: -1 })).toEqual([
      "currency must be a 3-letter uppercase code",
      "priceMinor must be a non-negative safe integer",
    ]);
    expect(validateSubscription({ ...subscription, quantity: 0 })).toContain("quantity must be a positive safe integer");
    expect(validateSubscription({ ...subscription, currentPeriodEnd: subscription.currentPeriodStart })).toContain(
      "currentPeriodEnd must be after currentPeriodStart",
    );
  });

  it("emits a versioned provider-neutral integration intent", () => {
    expect(toSubscriptionIntent(subscription, "pause")).toEqual({
      type: "sky.subscription.intent.v1",
      subscriptionId: "sub-1",
      customerId: "cus-1",
      planId: "pro",
      quantity: 2,
      action: "pause",
    });
  });
});
