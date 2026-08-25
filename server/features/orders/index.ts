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

export function validateOrder(order: Order): string[] {
  const errors: string[] = [];
  if (!order.id.trim()) errors.push("id is required");
  if (!/^[A-Z]{3}$/.test(order.currency)) errors.push("currency must be a 3-letter uppercase code");
  if (order.lines.length === 0) errors.push("at least one order line is required");
  for (const line of order.lines) {
    if (!line.sku.trim()) errors.push("sku is required");
    if (!Number.isSafeInteger(line.quantity) || line.quantity <= 0) errors.push(`quantity must be positive for ${line.sku || "<empty>"}`);
    if (!Number.isSafeInteger(line.unitPriceMinor) || line.unitPriceMinor < 0) errors.push(`unitPriceMinor must be non-negative for ${line.sku || "<empty>"}`);
  }
  return errors;
}

export function orderTotalMinor(order: Order): number {
  return order.lines.reduce((total, line) => {
    const lineTotal = line.quantity * line.unitPriceMinor;
    if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(total + lineTotal)) {
      throw new Error("order total exceeds safe integer range");
    }
    return total + lineTotal;
  }, 0);
}

export function evaluatePlacement(order: Order, availability: readonly InventoryAvailability[]): PlacementDecision {
  const errors = validateOrder(order);
  const totalMinor = errors.length === 0 ? orderTotalMinor(order) : 0;
  if (errors.length > 0) return { accepted: false, reason: errors.join("; "), totalMinor, shortages: [] };
  if (order.status !== "draft") return { accepted: false, reason: "order-not-draft", totalMinor, shortages: [] };

  const bySku = new Map(availability.map(item => [item.sku, item.available]));
  const requestedBySku = new Map<string, number>();
  for (const line of order.lines) requestedBySku.set(line.sku, (requestedBySku.get(line.sku) ?? 0) + line.quantity);

  const shortages = [...requestedBySku.entries()]
    .map(([sku, requested]) => ({ sku, requested, available: bySku.get(sku) ?? 0 }))
    .filter(item => item.available < item.requested)
    .sort((a, b) => a.sku.localeCompare(b.sku));

  if (shortages.length > 0) return { accepted: false, reason: "inventory-shortage", totalMinor, shortages };
  return { accepted: true, totalMinor, shortages: [] };
}

export function transitionOrder(order: Order, next: OrderStatus): Order {
  const allowed: Record<OrderStatus, readonly OrderStatus[]> = {
    draft: ["placed", "cancelled"],
    placed: ["cancelled", "fulfilled"],
    cancelled: [],
    fulfilled: [],
  };
  if (!allowed[order.status].includes(next)) throw new Error(`invalid order transition: ${order.status} -> ${next}`);
  return { ...order, status: next };
}
