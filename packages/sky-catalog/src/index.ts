export type CatalogItemStatus = "draft" | "active" | "archived";

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  status: CatalogItemStatus;
  priceMinor: number;
  currency: string;
  available: number | null;
}

export interface InventoryAvailabilityContract {
  contract: "skyinventory.availability.v1";
  sku: string;
  available: number;
}

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const SKU = /^[A-Za-z0-9._-]{1,80}$/;
const CURRENCY = /^[A-Z]{3}$/;

export class CatalogService {
  private readonly items = new Map<string, CatalogItem>();

  create(input: Omit<CatalogItem, "status" | "available">): CatalogItem {
    const id = validateIdentifier("catalogItemId", input.id);
    const sku = validateSku(input.sku);
    const name = validateText("name", input.name, 160);
    const description = validateText("description", input.description, 2000);
    const currency = input.currency.trim().toUpperCase();
    if (!CURRENCY.test(currency)) throw new Error("invalid_currency");
    if (!Number.isSafeInteger(input.priceMinor) || input.priceMinor < 0) {
      throw new Error("invalid_price");
    }
    if (this.items.has(id)) throw new Error("catalog_item_exists");
    if ([...this.items.values()].some(item => item.sku === sku)) {
      throw new Error("catalog_sku_exists");
    }
    const record: CatalogItem = {
      id,
      sku,
      name,
      description,
      status: "draft",
      priceMinor: input.priceMinor,
      currency,
      available: null,
    };
    this.items.set(id, { ...record });
    return { ...record };
  }

  get(id: string): CatalogItem | undefined {
    const item = this.items.get(validateIdentifier("catalogItemId", id));
    return item ? { ...item } : undefined;
  }

  publish(id: string): CatalogItem {
    const item = this.require(id);
    if (item.status !== "draft") throw new Error("catalog_item_not_draft");
    return this.save({ ...item, status: "active" });
  }

  archive(id: string): CatalogItem {
    const item = this.require(id);
    if (item.status === "archived") return item;
    return this.save({ ...item, status: "archived" });
  }

  applyAvailability(contract: InventoryAvailabilityContract): CatalogItem {
    if (contract.contract !== "skyinventory.availability.v1") {
      throw new Error("unsupported_inventory_contract");
    }
    const sku = validateSku(contract.sku);
    if (!Number.isSafeInteger(contract.available) || contract.available < 0) {
      throw new Error("invalid_inventory_availability");
    }
    const item = [...this.items.values()].find(
      candidate => candidate.sku === sku
    );
    if (!item) throw new Error("catalog_sku_not_found");
    return this.save({ ...item, available: contract.available });
  }

  listActive(): CatalogItem[] {
    return [...this.items.values()]
      .filter(item => item.status === "active")
      .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id))
      .map(item => ({ ...item }));
  }

  private require(id: string): CatalogItem {
    const item = this.get(id);
    if (!item) throw new Error("catalog_item_not_found");
    return item;
  }

  private save(item: CatalogItem): CatalogItem {
    this.items.set(item.id, { ...item });
    return { ...item };
  }
}

function validateIdentifier(name: string, value: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) {
    throw new Error(`invalid_${name}`);
  }
  return value;
}

function validateSku(value: string): string {
  if (typeof value !== "string" || !SKU.test(value))
    throw new Error("invalid_sku");
  return value;
}

function validateText(name: string, value: string, max: number): string {
  if (typeof value !== "string") throw new Error(`invalid_${name}`);
  const text = value.trim();
  if (!text || text.length > max || /[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error(`invalid_${name}`);
  }
  return text;
}
