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

  it("canonicalizes identifiers before uniqueness checks and storage", () => {
    expect(() =>
      createPaymentIntent([intent], {
        ...intent,
        id: " pay-1 ",
        idempotencyKey: " checkout-2 ",
      }),
    ).toThrow("payment intent already exists");

    expect(() =>
      createPaymentIntent([intent], {
        ...intent,
        id: "pay-2",
        idempotencyKey: " checkout-1 ",
      }),
    ).toThrow("idempotency key already exists");

    expect(
      createPaymentIntent([], {
        ...intent,
        id: " pay-2 ",
        accountId: " acct-1 ",
        idempotencyKey: " checkout-2 ",
      })[0],
    ).toMatchObject({
      id: "pay-2",
      accountId: "acct-1",
      idempotencyKey: "checkout-2",
    });
  });

  it("requires new intents to start as created", () => {
    expect(() =>
      createPaymentIntent([], {
        ...intent,
        status: "declined",
      }),
    ).toThrow("new payment intents must start in created status");
  });

  it("requires provider evidence for authorized and captured state", () => {
    expect(
      validatePaymentIntent({
        ...intent,
        status: "authorized",
      }),
    ).toContain("providerReference is required for authorized or captured intents");
    expect(
      validatePaymentIntent({
        ...intent,
        status: "captured",
      }),
    ).toContain("providerReference is required for authorized or captured intents");
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

  it("rejects transitions from malformed post-creation state", () => {
    expect(() =>
      transitionPaymentIntent(
        {
          ...intent,
          status: "authorized",
        },
        "captured",
        "capture-1",
      ),
    ).toThrow("providerReference is required for authorized or captured intents");
  });

  it("states the non-execution integration boundary", () => {
    expect(SKY_PAYMENTS_CONTRACT).toEqual({
      command: "sky.payments.authorization-plan.v1",
      guarantee: "planning-only",
      executesPayment: false,
    });
  });
});
