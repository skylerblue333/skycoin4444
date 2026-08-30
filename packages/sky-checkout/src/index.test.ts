import { describe, expect, it } from "vitest";
import { quoteCheckout } from "./index";

describe("quoteCheckout", () => {
  it("produces a deterministic bounded quote", () => {
    expect(
      quoteCheckout({
        checkoutId: "checkout-1",
        currency: "usd",
        lines: [
          { sku: "sku-a", quantity: 2, unitAmountMinor: 1250 },
          { sku: "sku-b", quantity: 1, unitAmountMinor: 500 },
        ],
        shippingAmountMinor: 300,
        taxAmountMinor: 240,
        discountAmountMinor: 100,
      }),
    ).toEqual({
      contract: "sky.checkout.quote.v1",
      checkoutId: "checkout-1",
      currency: "USD",
      subtotalMinor: 3000,
      shippingAmountMinor: 300,
      taxAmountMinor: 240,
      discountAmountMinor: 100,
      totalAmountMinor: 3440,
    });
  });

  it("rejects invalid money, quantity, and excessive discounts", () => {
    expect(() => quoteCheckout({ checkoutId: "x", currency: "USD", lines: [] })).toThrow("lines are required");
    expect(() => quoteCheckout({ checkoutId: "x", currency: "USD", lines: [{ sku: "a", quantity: 0, unitAmountMinor: 1 }] })).toThrow("quantity");
    expect(() => quoteCheckout({ checkoutId: "x", currency: "USD", lines: [{ sku: "a", quantity: 1, unitAmountMinor: -1 }] })).toThrow("unitAmountMinor");
    expect(() => quoteCheckout({ checkoutId: "x", currency: "USD", lines: [{ sku: "a", quantity: 1, unitAmountMinor: 100 }], discountAmountMinor: 101 })).toThrow("cannot exceed gross");
  });

  it("rejects malformed identifiers and currency codes", () => {
    expect(() => quoteCheckout({ checkoutId: " ", currency: "USD", lines: [{ sku: "a", quantity: 1, unitAmountMinor: 100 }] })).toThrow("checkoutId");
    expect(() => quoteCheckout({ checkoutId: "x", currency: "US", lines: [{ sku: "a", quantity: 1, unitAmountMinor: 100 }] })).toThrow("3-letter");
  });
});
