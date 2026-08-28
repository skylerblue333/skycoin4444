export interface InventoryItem {
  sku: string;
  onHand: number;
  reserved: number;
}

export type InventoryOperation =
  | { type: "receive"; quantity: number }
  | { type: "reserve"; quantity: number }
  | { type: "release"; quantity: number }
  | { type: "ship"; quantity: number };

function assertSku(sku: string): void {
  if (typeof sku !== "string" || !/^[A-Za-z0-9._-]{1,80}$/.test(sku)) throw new TypeError("sku must contain 1-80 safe identifier characters");
}

function assertQuantity(quantity: number): void {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new RangeError("quantity must be a positive safe integer");
}

function validateItem(item: InventoryItem): void {
  assertSku(item.sku);
  if (!Number.isSafeInteger(item.onHand) || item.onHand < 0) throw new RangeError("onHand must be a non-negative safe integer");
  if (!Number.isSafeInteger(item.reserved) || item.reserved < 0) throw new RangeError("reserved must be a non-negative safe integer");
  if (item.reserved > item.onHand) throw new RangeError("reserved inventory cannot exceed onHand");
}

export function createInventoryItem(sku: string, onHand = 0): InventoryItem {
  const item = { sku, onHand, reserved: 0 };
  validateItem(item);
  return item;
}

export function available(item: InventoryItem): number {
  validateItem(item);
  return item.onHand - item.reserved;
}

export function applyInventoryOperation(item: InventoryItem, operation: InventoryOperation): InventoryItem {
  validateItem(item);
  assertQuantity(operation.quantity);
  switch (operation.type) {
    case "receive": {
      const nextOnHand = item.onHand + operation.quantity;
      if (!Number.isSafeInteger(nextOnHand)) throw new RangeError("receive would exceed safe integer inventory bounds");
      return { ...item, onHand: nextOnHand };
    }
    case "reserve": {
      if (operation.quantity > available(item)) throw new Error("insufficient available inventory");
      const reserved = item.reserved + operation.quantity;
      if (!Number.isSafeInteger(reserved)) throw new RangeError("reservation would exceed safe integer bounds");
      return { ...item, reserved };
    }
    case "release":
      if (operation.quantity > item.reserved) throw new Error("cannot release more than reserved");
      return { ...item, reserved: item.reserved - operation.quantity };
    case "ship":
      if (operation.quantity > item.reserved) throw new Error("shipping requires an existing reservation");
      return { ...item, onHand: item.onHand - operation.quantity, reserved: item.reserved - operation.quantity };
  }
}

export function toCatalogAvailability(item: InventoryItem) {
  validateItem(item);
  return { contract: "skyinventory.availability.v1" as const, sku: item.sku, available: available(item) };
}
