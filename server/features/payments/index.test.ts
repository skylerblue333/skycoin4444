import { describe, expect, it } from "vitest";
import {
  createPaymentIntent,
  planPaymentAuthorization,
  SKY_PAYMENTS_CONTRACT,
  transitionPaymentIntent,
  validatePaymentIntent,
} from "./index";

const intent = {
  id: "pay-1",
  accountId: "acct-1",
  amountMinor: 1250,
  currency: "USD",
  idempotencyKey: "checkout-1",
  status: "created" as const,
};

describe("SkyPayments", () => {
  it("validates integer minor-unit amounts and currency", () => {
    expect(validatePaymentIntent(intent)).toEqual([]);
    expect(
      validatePaymentIntent({ ...intent, amountMinor: 1.5, currency: "usd" }),
    ).toEqual([
      "amountMinor must be a positive safe integer",
      "currency must be a 3-letter uppercase code",
    ]);
  });

  it("rejects duplicate ids and idempotency keys", () => {
    expect(() => createPaymentIntent([intent], intent)).toThrow(
      "payment intent already exists",
    );
    expect(() =>
      createPaymentIntent([intent], { ...intent, id: "pay-2" }),
    ).toThrow("idempotency key already exists");
  });

  it("creates a deterministic external authorization plan", () => {
    expect(
      planPaymentAuthorization(intent, {
        intentId: "pay-1",
        provider: "sandbox-adapter",
        paymentMethodReference: "pm-ref-1",
      }),
    ).toEqual({
      contract: "sky.payments.authorization-plan.v1",
      intentId: "pay-1",
      provider: "sandbox-adapter",
      paymentMethodReference: "pm-ref-1",
      amountMinor: 1250,
      currency: "USD",
      executeExternally: true,
    });
  });

  it("enforces payment lifecycle and provider evidence", () => {
    expect(() => transitionPaymentIntent(intent, "authorized")).toThrow(
      "providerReference is required",
    );
    const authorized = transitionPaymentIntent(intent, "authorized", "provider-1");
    expect(transitionPaymentIntent(authorized, "captured", "capture-1")).toMatchObject({
      status: "captured",
      providerReference: "capture-1",
    });
    expect(() => transitionPaymentIntent(intent, "captured", "capture-1")).toThrow(
      "invalid payment transition",
    );
  });

  it("states the non-execution integration boundary", () => {
    expect(SKY_PAYMENTS_CONTRACT).toEqual({
      command: "sky.payments.authorization-plan.v1",
      guarantee: "planning-only",
      executesPayment: false,
    });
  });
});
