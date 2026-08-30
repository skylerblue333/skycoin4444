export type SubscriptionStatus = "trialing" | "active" | "paused" | "cancelled";

export interface SubscriptionPlan {
  id: string;
  interval: "month" | "year";
  priceMinor: number;
  currency: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  quantity: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionIntentV1 {
  type: "sky.subscription.intent.v1";
  subscriptionId: string;
  customerId: string;
  planId: string;
  quantity: number;
  action: "activate" | "pause" | "resume" | "cancel";
  cancelAtPeriodEnd: boolean;
}

function isIsoTimestamp(value: string): boolean {
  if (!value.trim()) return false;
  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  return isoPattern.test(value) && Number.isFinite(Date.parse(value));
}

export function validatePlan(plan: SubscriptionPlan): string[] {
  const errors: string[] = [];
  if (!plan.id.trim()) errors.push("plan id is required");
  if (!/^[A-Z]{3}$/.test(plan.currency)) errors.push("currency must be a 3-letter uppercase code");
  if (!Number.isSafeInteger(plan.priceMinor) || plan.priceMinor < 0) errors.push("priceMinor must be a non-negative safe integer");
  return errors;
}

export function validateSubscription(subscription: Subscription): string[] {
  const errors: string[] = [];
  if (!subscription.id.trim()) errors.push("subscription id is required");
  if (!subscription.customerId.trim()) errors.push("customer id is required");
  if (!subscription.planId.trim()) errors.push("plan id is required");
  if (!Number.isSafeInteger(subscription.quantity) || subscription.quantity <= 0) errors.push("quantity must be a positive safe integer");
  if (!isIsoTimestamp(subscription.currentPeriodStart)) errors.push("currentPeriodStart must be an ISO timestamp");
  if (!isIsoTimestamp(subscription.currentPeriodEnd)) errors.push("currentPeriodEnd must be an ISO timestamp");
  if (errors.length === 0 && Date.parse(subscription.currentPeriodEnd) <= Date.parse(subscription.currentPeriodStart)) {
    errors.push("currentPeriodEnd must be after currentPeriodStart");
  }
  return errors;
}

export function recurringAmountMinor(plan: SubscriptionPlan, quantity: number): number {
  const errors = validatePlan(plan);
  if (errors.length > 0) throw new Error(errors.join("; "));
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new Error("quantity must be a positive safe integer");
  const total = plan.priceMinor * quantity;
  if (!Number.isSafeInteger(total)) throw new Error("recurring amount exceeds safe integer range");
  return total;
}

export function transitionSubscription(subscription: Subscription, next: SubscriptionStatus): Subscription {
  const allowed: Record<SubscriptionStatus, readonly SubscriptionStatus[]> = {
    trialing: ["active", "cancelled"],
    active: ["paused", "cancelled"],
    paused: ["active", "cancelled"],
    cancelled: [],
  };
  if (!allowed[subscription.status].includes(next)) {
    throw new Error(`invalid subscription transition: ${subscription.status} -> ${next}`);
  }
  return { ...subscription, status: next };
}

export function requestPeriodEndCancellation(subscription: Subscription): Subscription {
  if (subscription.status === "cancelled") throw new Error("cancelled subscription cannot be scheduled for cancellation");
  return { ...subscription, cancelAtPeriodEnd: true };
}

export function toSubscriptionIntent(subscription: Subscription, action: SubscriptionIntentV1["action"]): SubscriptionIntentV1 {
  const errors = validateSubscription(subscription);
  if (errors.length > 0) throw new Error(errors.join("; "));
  return {
    type: "sky.subscription.intent.v1",
    subscriptionId: subscription.id,
    customerId: subscription.customerId,
    planId: subscription.planId,
    quantity: subscription.quantity,
    action,
    cancelAtPeriodEnd: action === "cancel" ? subscription.cancelAtPeriodEnd : false,
  };
}
