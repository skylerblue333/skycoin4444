import { describe, expect, it } from "vitest";
import {
  createInventoryItem,
  toCatalogAvailability,
} from "../../sky-inventory/src/index";
import { CatalogService } from "./index";

describe("SkyCatalog domain core", () => {
  it("publishes validated catalog items deterministically", () => {
    const service = new CatalogService();
    const item = service.create({
      id: "item_1",
      sku: "SKU-1",
      name: "Starter Plan",
      description: "Bounded local catalog entry",
      priceMinor: 2500,
      currency: "usd",
    });

    expect(item.status).toBe("draft");
    expect(service.publish(item.id).status).toBe("active");
    expect(service.listActive().map(active => active.id)).toEqual(["item_1"]);
  });

  it("accepts the merged SkyInventory availability contract", () => {
    const service = new CatalogService();
    service.create({
      id: "item_2",
      sku: "SKU-2",
      name: "Physical Kit",
      description: "Inventory-linked metadata",
      priceMinor: 9900,
      currency: "USD",
    });
    const inventory = createInventoryItem("SKU-2", 7);

    expect(
      service.applyAvailability(toCatalogAvailability(inventory)).available
    ).toBe(7);
  });

  it("rejects invalid catalog inputs and unsupported inventory data", () => {
    const service = new CatalogService();
    expect(() =>
      service.create({
        id: "bad item",
        sku: "SKU-1",
        name: "Name",
        description: "Description",
        priceMinor: 1,
        currency: "USD",
      })
    ).toThrow("invalid_catalogItemId");

    service.create({
      id: "item_3",
      sku: "SKU-3",
      name: "Name",
      description: "Description",
      priceMinor: 1,
      currency: "USD",
    });
    expect(() =>
      service.applyAvailability({
        contract: "skyinventory.availability.v1",
        sku: "SKU-3",
        available: -1,
      })
    ).toThrow("invalid_inventory_availability");
  });

  it("archives items idempotently and removes them from active listings", () => {
    const service = new CatalogService();
    const item = service.create({
      id: "item_4",
      sku: "SKU-4",
      name: "Archive Me",
      description: "Lifecycle test",
      priceMinor: 0,
      currency: "USD",
    });
    service.publish(item.id);
    expect(service.archive(item.id).status).toBe("archived");
    expect(service.archive(item.id).status).toBe("archived");
    expect(service.listActive()).toEqual([]);
  });
});
