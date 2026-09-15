import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  commerceSandboxDeliveryScenarios,
  commerceSandboxPromoFixtures,
} from "../../client/src/lib/commerceSandbox";

const commercePage = fs.readFileSync(
  "client/src/pages/BetaCommerceSandbox.tsx",
  "utf8"
);

describe("V3 commerce product-depth release contract", () => {
  it("keeps discovery, saved-item, cart, promo, and delivery planning in one loop", () => {
    expect(commercePage).toMatch(/Discover, save, cart, plan, and quote/);
    expect(commercePage).toMatch(/Save .* for later/);
    expect(commercePage).toMatch(/Add saved to cart/);
    expect(commercePage).toMatch(/Promo fixture/);
    expect(commercePage).toMatch(/Delivery-cost scenario/);
    expect(commercePage).toMatch(/Total quote/);
  });

  it("ships a bounded controlled set of promo and delivery fixtures", () => {
    expect(commerceSandboxPromoFixtures.map(promo => promo.code)).toEqual([
      "LEARN10",
      "CREATOR15",
      "COMMUNITY5",
    ]);
    expect(commerceSandboxDeliveryScenarios.map(option => option.id)).toEqual([
      "collection",
      "standard",
      "express",
    ]);
  });

  it("preserves explicit non-transactional boundaries", () => {
    expect(commercePage).toMatch(/Payment and fulfillment are intentionally disabled/);
    expect(commercePage).toMatch(/No address, card, bank/);
    expect(commercePage).toMatch(/Payment unavailable in beta/);
    expect(commercePage).toMatch(/not an order or authorization/);
    expect(commercePage).toMatch(/No personal delivery address/);
  });
});
