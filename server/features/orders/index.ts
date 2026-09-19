export type OrderStatus = "draft" | "placed" | "cancelled" | "fulfilled";

export interface OrderLine {
  sku: string;
  quantity: number;
  unitPriceMinor: number;
}

export interface Order {
  id: string;
  currency: string;
  status: OrderStatus;
  lines: readonly OrderLine[];
  customerId?: string;
}

export interface InventoryAvailability {
  sku: string;
  available: number;
}

export interface PlacementDecision {
  accepted: boolean;
  reason?: string;
  totalMinor: number;
  shortages: Array<{ sku: string; requested: number; available: number }>;
}

const orderStatuses = new Set<string>([
  "draft",
  "placed",
  "cancelled",
  "fulfilled",
]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && orderStatuses.has(value);
}

function validateOrderLineNumbers(line: OrderLine): string[] {
  if (!isObjectRecord(line)) return ["order line is required"];

  const errors: string[] = [];
  const sku = isNonBlankString(line.sku) ? line.sku : "<empty>";
  if (!Number.isSafeInteger(line.quantity) || (line.quantity as number) <= 0) {
    errors.push(`quantity must be positive for ${sku}`);
  }
  if (
    !Number.isSafeInteger(line.unitPriceMinor) ||
    (line.unitPriceMinor as number) < 0
  ) {
    errors.push(`unitPriceMinor must be non-negative for ${sku}`);
  }
  return errors;
}

export function validateOrder(order: Order): string[] {
  if (!isObjectRecord(order)) return ["order is required"];

  const errors: string[] = [];
  if (!isNonBlankString(order.id)) errors.push("id is required");
  if (
    typeof order.currency !== "string" ||
    !/^[A-Z]{3}$/.test(order.currency)
  ) {
    errors.push("currency must be a 3-letter uppercase code");
  }
  if (!isOrderStatus(order.status)) errors.push("status is invalid");
  if (!Array.isArray(order.lines)) {
    errors.push("lines must be an array");
    return errors;
  }
  if (order.lines.length === 0) {
    errors.push("at least one order line is required");
  }

  const quantityBySku = new Map<string, number>();
  const overflowedSkus = new Set<string>();

  for (const [index, line] of order.lines.entries()) {
    if (!isObjectRecord(line)) {
      errors.push(`order line is required at index ${index}`);
      continue;
    }

    const sku = isNonBlankString(line.sku) ? line.sku : "";
    if (!sku) errors.push("sku is required");

    const lineErrors = validateOrderLineNumbers(line as unknown as OrderLine);
    errors.push(...lineErrors);

    const validQuantity =
      Number.isSafeInteger(line.quantity) && (line.quantity as number) > 0;

    if (sku && validQuantity && !overflowedSkus.has(sku)) {
      const combined =
        (quantityBySku.get(sku) ?? 0) + (line.quantity as number);
      if (!Number.isSafeInteger(combined)) {
        errors.push(`total quantity exceeds safe integer range for ${sku}`);
        overflowedSkus.add(sku);
        quantityBySku.delete(sku);
      } else {
        quantityBySku.set(sku, combined);
      }
    }
  }
  return errors;
}

export function validateAvailability(
  availability: readonly InventoryAvailability[],
): string[] {
  if (!Array.isArray(availability)) {
    return ["availability must be an array"];
  }

  const errors: string[] = [];
  const seen = new Set<string>();

  for (const [index, item] of availability.entries()) {
    if (!isObjectRecord(item)) {
      errors.push(`availability item is required at index ${index}`);
      continue;
    }

    const sku = isNonBlankString(item.sku) ? item.sku : "";
    if (!sku) errors.push("availability sku is required");
    if (
      !Number.isSafeInteger(item.available) ||
      (item.available as number) < 0
    ) {
      errors.push(
        `availability must be a non-negative safe integer for ${sku || "<empty>"}`,
      );
    }
    if (sku && seen.has(sku)) {
      errors.push(`duplicate availability sku: ${sku}`);
    }
    if (sku) seen.add(sku);
  }

  return errors;
}

export function orderTotalMinor(order: Order): number {
  const errors = validateOrder(order);
  if (errors.length > 0) {
    throw new Error(`invalid order: ${errors.join("; ")}`);
  }

  return order.lines.reduce((total, line) => {
    const lineTotal = line.quantity * line.unitPriceMinor;
    if (
      !Number.isSafeInteger(lineTotal) ||
      !Number.isSafeInteger(total + lineTotal)
    ) {
      throw new Error("order total exceeds safe integer range");
    }
    return total + lineTotal;
  }, 0);
}

export function evaluatePlacement(
  order: Order,
  availability: readonly InventoryAvailability[],
): PlacementDecision {
  const errors = validateOrder(order);
  if (errors.length > 0) {
    return {
      accepted: false,
      reason: errors.join("; "),
      totalMinor: 0,
      shortages: [],
    };
  }

  const totalMinor = orderTotalMinor(order);
  if (order.status !== "draft") {
    return {
      accepted: false,
      reason: "order-not-draft",
      totalMinor,
      shortages: [],
    };
  }

  const availabilityErrors = validateAvailability(availability);
  if (availabilityErrors.length > 0) {
    return {
      accepted: false,
      reason: availabilityErrors.join("; "),
      totalMinor,
      shortages: [],
    };
  }

  const bySku = new Map(availability.map(item => [item.sku, item.available]));
  const requestedBySku = new Map<string, number>();
  for (const line of order.lines) {
    const combined = (requestedBySku.get(line.sku) ?? 0) + line.quantity;
    if (!Number.isSafeInteger(combined)) {
      return {
        accepted: false,
        reason: `total quantity exceeds safe integer range for ${line.sku}`,
        totalMinor,
        shortages: [],
      };
    }
    requestedBySku.set(line.sku, combined);
  }

  const shortages = [...requestedBySku.entries()]
    .map(([sku, requested]) => ({
      sku,
      requested,
      available: bySku.get(sku) ?? 0,
    }))
    .filter(item => item.available < item.requested)
    .sort((a, b) => (a.sku < b.sku ? -1 : a.sku > b.sku ? 1 : 0));

  if (shortages.length > 0) {
    return {
      accepted: false,
      reason: "inventory-shortage",
      totalMinor,
      shortages,
    };
  }
  return { accepted: true, totalMinor, shortages: [] };
}

export function transitionOrder(order: Order, next: OrderStatus): Order {
  const allowed: Record<OrderStatus, readonly OrderStatus[]> = {
    draft: ["placed", "cancelled"],
    placed: ["cancelled", "fulfilled"],
    cancelled: [],
    fulfilled: [],
  };

  if (!isObjectRecord(order)) {
    throw new Error("order is required");
  }
  if (!isOrderStatus(order.status)) {
    throw new Error(`invalid current order status: ${String(order.status)}`);
  }
  if (!isOrderStatus(next)) {
    throw new Error(`invalid target order status: ${String(next)}`);
  }
  if (!allowed[order.status].includes(next)) {
    throw new Error(
      `invalid order transition: ${order.status} -> ${next}`,
    );
  }
  return { ...order, status: next } as Order;
}
