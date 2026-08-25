export type PaymentIntentStatus =
  | "created"
  | "authorized"
  | "declined"
  | "captured"
  | "cancelled";

export interface PaymentIntent {
  id: string;
  accountId: string;
  amountMinor: number;
  currency: string;
  idempotencyKey: string;
  status: PaymentIntentStatus;
  providerReference?: string;
}

export interface PaymentAuthorizationRequest {
  intentId: string;
  provider: string;
  paymentMethodReference: string;
}

export interface PaymentAuthorizationPlan {
  contract: "sky.payments.authorization-plan.v1";
  intentId: string;
  provider: string;
  paymentMethodReference: string;
  amountMinor: number;
  currency: string;
  executeExternally: true;
}

const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CURRENCY = /^[A-Z]{3}$/;

function requireSafeId(value: string, field: string): string {
  const normalized = value.trim();
  if (!SAFE_ID.test(normalized)) throw new Error(`${field} is invalid`);
  return normalized;
}

export function validatePaymentIntent(intent: PaymentIntent): string[] {
  const errors: string[] = [];
  if (!SAFE_ID.test(intent.id.trim())) errors.push("id is invalid");
  if (!SAFE_ID.test(intent.accountId.trim())) errors.push("accountId is invalid");
  if (!Number.isSafeInteger(intent.amountMinor) || intent.amountMinor <= 0) {
    errors.push("amountMinor must be a positive safe integer");
  }
  if (!CURRENCY.test(intent.currency)) errors.push("currency must be a 3-letter uppercase code");
  if (!SAFE_ID.test(intent.idempotencyKey.trim())) errors.push("idempotencyKey is invalid");
  if (intent.providerReference !== undefined && !SAFE_ID.test(intent.providerReference.trim())) {
    errors.push("providerReference is invalid");
  }
  return errors;
}

export function createPaymentIntent(
  existing: readonly PaymentIntent[],
  candidate: PaymentIntent,
): PaymentIntent[] {
  const errors = validatePaymentIntent(candidate);
  if (errors.length > 0) throw new Error(errors.join("; "));
  if (existing.some(intent => intent.id === candidate.id)) {
    throw new Error(`payment intent already exists: ${candidate.id}`);
  }
  if (existing.some(intent => intent.idempotencyKey === candidate.idempotencyKey)) {
    throw new Error(`idempotency key already exists: ${candidate.idempotencyKey}`);
  }
  return [...existing, { ...candidate }].sort((a, b) => a.id.localeCompare(b.id));
}

export function planPaymentAuthorization(
  intent: PaymentIntent,
  request: PaymentAuthorizationRequest,
): PaymentAuthorizationPlan {
  const errors = validatePaymentIntent(intent);
  if (errors.length > 0) throw new Error(errors.join("; "));
  if (intent.status !== "created") throw new Error("only created intents can be authorized");
  const intentId = requireSafeId(request.intentId, "intentId");
  if (intentId !== intent.id) throw new Error("intentId does not match payment intent");
  const provider = requireSafeId(request.provider, "provider");
  const paymentMethodReference = requireSafeId(
    request.paymentMethodReference,
    "paymentMethodReference",
  );
  return {
    contract: "sky.payments.authorization-plan.v1",
    intentId,
    provider,
    paymentMethodReference,
    amountMinor: intent.amountMinor,
    currency: intent.currency,
    executeExternally: true,
  };
}

export function transitionPaymentIntent(
  intent: PaymentIntent,
  next: PaymentIntentStatus,
  providerReference?: string,
): PaymentIntent {
  const allowed: Record<PaymentIntentStatus, readonly PaymentIntentStatus[]> = {
    created: ["authorized", "declined", "cancelled"],
    authorized: ["captured", "cancelled"],
    declined: [],
    captured: [],
    cancelled: [],
  };
  if (!allowed[intent.status].includes(next)) {
    throw new Error(`invalid payment transition: ${intent.status} -> ${next}`);
  }
  if ((next === "authorized" || next === "captured") && !providerReference) {
    throw new Error("providerReference is required");
  }
  const normalizedReference = providerReference
    ? requireSafeId(providerReference, "providerReference")
    : intent.providerReference;
  return { ...intent, status: next, providerReference: normalizedReference };
}

export const SKY_PAYMENTS_CONTRACT = {
  command: "sky.payments.authorization-plan.v1",
  guarantee: "planning-only",
  executesPayment: false,
} as const;
