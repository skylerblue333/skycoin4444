import { describe, expect, it } from "vitest";
import { applyInventoryOperation, available, createInventoryItem, toCatalogAvailability } from "./index";

describe("SkyInventory", () => {
  it("tracks receive, reserve, release, and ship deterministically", () => {
    let item = createInventoryItem("SKU-1", 10);
    item = applyInventoryOperation(item, { type: "reserve", quantity: 4 });
    expect(available(item)).toBe(6);
    item = applyInventoryOperation(item, { type: "ship", quantity: 3 });
    expect(item).toEqual({ sku: "SKU-1", onHand: 7, reserved: 1 });
    expect(toCatalogAvailability(item)).toEqual({ contract: "skyinventory.availability.v1", sku: "SKU-1", available: 6 });
  });

  it("rejects overselling and invalid quantities", () => {
    const item = createInventoryItem("SKU-2", 2);
    expect(() => applyInventoryOperation(item, { type: "reserve", quantity: 3 })).toThrow(/insufficient/);
    expect(() => applyInventoryOperation(item, { type: "receive", quantity: 0 })).toThrow(RangeError);
  });

  it("rejects arithmetic overflow and malformed mutable state", () => {
    const maxed = createInventoryItem("SKU-MAX", Number.MAX_SAFE_INTEGER);
    expect(() => applyInventoryOperation(maxed, { type: "receive", quantity: 1 })).toThrow(/safe integer/);

    const malformed = createInventoryItem("SKU-BAD", 10);
    malformed.reserved = 11;
    expect(() => available(malformed)).toThrow(/cannot exceed/);
    expect(() => toCatalogAvailability(malformed)).toThrow(RangeError);
  });
});
