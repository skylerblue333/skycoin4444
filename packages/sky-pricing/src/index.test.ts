import { describe, expect, it } from "vitest";
import {
  quotePrice,
  validatePriceInput,
  validatePricingRule,
} from "./index";

const input = {
  sku: "sku:basic",
  baseAmountMinor: 1000,
  currency: "USD",
  quantity: 2,
};

describe("SkyPricing", () => {
  it("quotes integer minor-unit prices deterministically", () => {
    expect(
      quotePrice(input, [
        { id: "bulk", discountBps: 1000, minimumQuantity: 2 },
      ]),
    ).toEqual({
      sku: "sku:basic",
      currency: "USD",
      quantity: 2,
      subtotalMinor: 2000,
      discountMinor: 200,
      totalMinor: 1800,
      appliedRuleIds: ["bulk"],
    });
  });

  it("does not apply rules below minimum quantity", () => {
    expect(
      quotePrice(
        { ...input, quantity: 1 },
        [{ id: "bulk", discountBps: 1000, minimumQuantity: 2 }],
      ).totalMinor,
    ).toBe(1000);
  });

  it("caps combined discounts at 100 percent", () => {
    expect(
      quotePrice(input, [
        { id: "a", discountBps: 7000 },
        { id: "b", discountBps: 7000 },
      ]).totalMinor,
    ).toBe(0);
  });

  it("rejects unsafe monetary and discount inputs", () => {
    expect(() =>
      validatePriceInput({ ...input, baseAmountMinor: 1.5 }),
    ).toThrow("invalid baseAmountMinor");
    expect(() =>
      validatePricingRule({ id: "bad", discountBps: 10001 }),
    ).toThrow("invalid discountBps");
  });
});
