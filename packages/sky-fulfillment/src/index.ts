export type FulfillmentStatus = "planned" | "allocated" | "packed" | "shipped" | "cancelled";
export interface FulfillmentItem { sku: string; quantity: number; }
export interface FulfillmentPlan { id: string; orderId: string; status: FulfillmentStatus; items: FulfillmentItem[]; }

export function validateFulfillmentPlan(plan: FulfillmentPlan): FulfillmentPlan {
  if (!plan.id.trim() || !plan.orderId.trim()) throw new Error("id and orderId are required");
  if (!plan.items.length) throw new Error("at least one item is required");
  const seen = new Set<string>();
  const items = plan.items.map((item) => {
    const sku = item.sku.trim();
    if (!sku) throw new Error("sku is required");
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error("quantity must be a positive integer");
    if (seen.has(sku)) throw new Error("duplicate sku");
    seen.add(sku);
    return { sku, quantity: item.quantity };
  });
  return { ...plan, id: plan.id.trim(), orderId: plan.orderId.trim(), items };
}
export function canTransitionFulfillment(from: FulfillmentStatus, to: FulfillmentStatus): boolean {
  if (from === to) return true;
  const allowed: Record<FulfillmentStatus, FulfillmentStatus[]> = {
    planned: ["allocated", "cancelled"], allocated: ["packed", "cancelled"], packed: ["shipped", "cancelled"], shipped: [], cancelled: []
  };
  return allowed[from].includes(to);
}
export function totalUnits(plan: FulfillmentPlan): number { return validateFulfillmentPlan(plan).items.reduce((sum, item) => sum + item.quantity, 0); }
