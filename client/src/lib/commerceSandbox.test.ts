import { describe, expect, it } from "vitest";
import {
  buildCommerceSandboxQuotePlan,
  mergeWishlistIntoCommerceCart,
  normalizeCommercePromoCode,
  normalizeCommerceSandboxWishlist,
  quoteCommerceSandboxDelivery,
  resolveCommerceSandboxPromo,
  toggleCommerceSandboxWishlist,
} from "./commerceSandbox";

describe("commerce sandbox product-depth helpers", () => {
  it("normalizes wishlist entries against the controlled fixture catalog", () => {
    expect(
      normalizeCommerceSandboxWishlist([
        "FIXTURE-LANGUAGE-CARDS",
        "FIXTURE-LANGUAGE-CARDS",
        "UNKNOWN",
        42,
        "FIXTURE-USB-MIC",
      ])
    ).toEqual(["FIXTURE-LANGUAGE-CARDS", "FIXTURE-USB-MIC"]);
    expect(normalizeCommerceSandboxWishlist("not-an-array")).toEqual([]);
  });

  it("toggles known wishlist items and ignores unknown SKUs", () => {
    expect(toggleCommerceSandboxWishlist([], "FIXTURE-USB-MIC")).toEqual([
      "FIXTURE-USB-MIC",
    ]);
    expect(
      toggleCommerceSandboxWishlist(["FIXTURE-USB-MIC"], "FIXTURE-USB-MIC")
    ).toEqual([]);
    expect(toggleCommerceSandboxWishlist([], "UNKNOWN")).toEqual([]);
  });

  it("adds saved items to an existing cart without overwriting quantities", () => {
    expect(
      mergeWishlistIntoCommerceCart(
        { "FIXTURE-USB-MIC": 3 },
        ["FIXTURE-USB-MIC", "FIXTURE-LANGUAGE-CARDS"]
      )
    ).toEqual({
      "FIXTURE-USB-MIC": 3,
      "FIXTURE-LANGUAGE-CARDS": 1,
    });
  });

  it("normalizes fixture promo codes safely", () => {
    expect(normalizeCommercePromoCode(" learn 10 ")).toBe("LEARN10");
    expect(normalizeCommercePromoCode(" creator15 ")).toBe("CREATOR15");
  });

  it("applies category-specific deterministic promo math", () => {
    const learning = resolveCommerceSandboxPromo(
      { "FIXTURE-LANGUAGE-CARDS": 2 },
      "LEARN10"
    );
    expect(learning.recognized).toBe(true);
    expect(learning.applied).toBe(true);
    expect(learning.eligibleSubtotalMinor).toBe(2400);
    expect(learning.discountMinor).toBe(240);

    const creator = resolveCommerceSandboxPromo(
      { "FIXTURE-USB-MIC": 10 },
      "CREATOR15"
    );
    expect(creator.eligibleSubtotalMinor).toBe(32990);
    expect(creator.discountMinor).toBe(2500);
  });

  it("enforces the Community fixture threshold and rejects invented codes", () => {
    const below = resolveCommerceSandboxPromo(
      { "FIXTURE-COMMUNITY-GUIDE": 2 },
      "COMMUNITY5"
    );
    expect(below.eligibleSubtotalMinor).toBe(1800);
    expect(below.discountMinor).toBe(0);
    expect(below.applied).toBe(false);

    const above = resolveCommerceSandboxPromo(
      { "FIXTURE-COMMUNITY-GUIDE": 3 },
      "COMMUNITY5"
    );
    expect(above.discountMinor).toBe(500);
    expect(above.applied).toBe(true);

    const unknown = resolveCommerceSandboxPromo(
      { "FIXTURE-COMMUNITY-GUIDE": 3 },
      "FREE100"
    );
    expect(unknown.recognized).toBe(false);
    expect(unknown.discountMinor).toBe(0);
  });

  it("quotes bounded delivery scenarios without implying real fulfillment", () => {
    expect(quoteCommerceSandboxDelivery(0, "standard").amountMinor).toBe(0);
    expect(quoteCommerceSandboxDelivery(1, "standard").amountMinor).toBe(599);
    expect(quoteCommerceSandboxDelivery(3, "standard").amountMinor).toBe(799);
    expect(quoteCommerceSandboxDelivery(3, "express").amountMinor).toBe(1699);
    expect(quoteCommerceSandboxDelivery(3, "collection").amountMinor).toBe(0);
  });

  it("builds checkout-contract quotes with discount, delivery, and post-discount fixture tax", () => {
    const plan = buildCommerceSandboxQuotePlan(
      {
        "FIXTURE-LANGUAGE-CARDS": 2,
        "FIXTURE-USB-MIC": 1,
      },
      "LEARN10",
      "standard"
    );

    expect(plan.itemCount).toBe(3);
    expect(plan.promo.discountMinor).toBe(240);
    expect(plan.delivery.amountMinor).toBe(799);
    expect(plan.quote?.subtotalMinor).toBe(5699);
    expect(plan.taxAmountMinor).toBe(Math.round((5699 - 240) * 0.08));
    expect(plan.quote?.discountAmountMinor).toBe(240);
    expect(plan.quote?.shippingAmountMinor).toBe(799);
    expect(plan.quote?.totalAmountMinor).toBe(
      5699 + 799 + Math.round((5699 - 240) * 0.08) - 240
    );
  });

  it("keeps the empty cart as a first-class state", () => {
    const plan = buildCommerceSandboxQuotePlan({}, "LEARN10", "express");
    expect(plan.itemCount).toBe(0);
    expect(plan.quote).toBeNull();
    expect(plan.delivery.amountMinor).toBe(0);
    expect(plan.promo.discountMinor).toBe(0);
  });
});
