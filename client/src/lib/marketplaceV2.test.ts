import { describe, expect, it } from "vitest";
import { OFFICIAL_TRUMP_MINT } from "../../../shared/officialTrump";
import {
  MARKETPLACE_CAPABILITIES,
  OFFICIAL_TRUMP_MARKETPLACE_PAYMENT,
  filterMarketplaceProducts,
  marketplaceCapabilityCounts,
  marketplaceDemoProducts,
  marketplaceReviewSummary,
  reviewFixturesForProduct,
  unitPriceForQuantity,
} from "./marketplaceV2";

describe("marketplace V2 beta model", () => {
  it("keeps the 100-capability expansion map truth-labeled", () => {
    expect(MARKETPLACE_CAPABILITIES).toHaveLength(100);
    expect(marketplaceCapabilityCounts()).toEqual({
      "beta-surface": 20,
      "integration-contract": 20,
      roadmap: 60,
    });
  });

  it("filters and sorts the supplier-style fixture catalog deterministically", () => {
    const results = filterMarketplaceProducts(marketplaceDemoProducts, {
      query: "electronics",
      category: "All",
      sort: "rating",
      freeShippingOnly: true,
      fourStarsOnly: true,
      supplierTier: "demo-verified",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(item => item.source === "demo-fixture")).toBe(true);
    expect(results.every(item => item.freeShipping)).toBe(true);
    expect(results.every(item => item.rating >= 4)).toBe(true);
    expect(results.every(item => item.supplier.tier === "demo-verified")).toBe(true);
  });

  it("uses fixture ranges that make rating and MOQ filters observable", () => {
    const fourStars = filterMarketplaceProducts(marketplaceDemoProducts, {
      fourStarsOnly: true,
    });
    const lowMoq = filterMarketplaceProducts(marketplaceDemoProducts, {
      maxMinOrder: 5,
    });

    expect(fourStars.length).toBeGreaterThan(0);
    expect(fourStars.length).toBeLessThan(marketplaceDemoProducts.length);
    expect(fourStars.every(item => item.rating >= 4)).toBe(true);

    expect(lowMoq.length).toBeGreaterThan(0);
    expect(lowMoq.length).toBeLessThan(marketplaceDemoProducts.length);
    expect(lowMoq.every(item => item.minOrder <= 5)).toBe(true);
  });

  it("applies quantity price breaks without claiming a live supplier quote", () => {
    const earbuds = marketplaceDemoProducts.find(
      item => item.sku === "DEMO-WIRELESS-EARBUDS"
    );
    expect(earbuds).toBeDefined();
    expect(unitPriceForQuantity(earbuds!, 1)).toBe(1899);
    expect(unitPriceForQuantity(earbuds!, 10)).toBe(1699);
    expect(unitPriceForQuantity(earbuds!, 50)).toBe(1499);
  });

  it("keeps review data explicitly fixture-backed", () => {
    const reviews = reviewFixturesForProduct("DEMO-MAKEUP-BRUSH");
    const summary = marketplaceReviewSummary("DEMO-MAKEUP-BRUSH");

    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every(review => review.verificationMode === "demo-fixture")).toBe(true);
    expect(summary.verifiedFixtureCount).toBe(summary.fixtureCount);
    expect(summary.average).toBeGreaterThanOrEqual(1);
    expect(summary.average).toBeLessThanOrEqual(5);
  });

  it("reuses the configured Official TRUMP asset without enabling settlement", () => {
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.asset.contractAddress).toBe(
      OFFICIAL_TRUMP_MINT
    );
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.asset.symbol).toBe("TRUMP");
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.priceOracleConnected).toBe(false);
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.settlementEnabled).toBe(false);
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.custodyEnabled).toBe(false);
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.signingEnabled).toBe(false);
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.broadcastEnabled).toBe(false);
    expect(OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.affiliationClaimed).toBe(false);
  });
});
