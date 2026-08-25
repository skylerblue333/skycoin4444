export type EscrowState = "draft" | "funded" | "released" | "cancelled" | "disputed";

export interface EscrowRecord {
  id: string;
  buyerId: string;
  sellerId: string;
  amountMinor: bigint;
  currency: string;
  state: EscrowState;
}

export type EscrowAction = "fund" | "release" | "cancel" | "dispute";

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CURRENCY_RE = /^[A-Z]{3}$/;

function validId(value: string, field: string): string {
  const normalized = value.trim();
  if (!ID_RE.test(normalized)) throw new Error(`${field} is invalid`);
  return normalized;
}

export function createEscrow(input: Omit<EscrowRecord, "state">): EscrowRecord {
  const id = validId(input.id, "id");
  const buyerId = validId(input.buyerId, "buyerId");
  const sellerId = validId(input.sellerId, "sellerId");
  if (buyerId === sellerId) throw new Error("buyer and seller must differ");
  if (input.amountMinor <= 0n) throw new Error("amountMinor must be positive");
  const currency = input.currency.trim().toUpperCase();
  if (!CURRENCY_RE.test(currency)) throw new Error("currency must be a 3-letter code");
  return { id, buyerId, sellerId, amountMinor: input.amountMinor, currency, state: "draft" };
}

const transitions: Record<EscrowState, Partial<Record<EscrowAction, EscrowState>>> = {
  draft: { fund: "funded", cancel: "cancelled" },
  funded: { release: "released", cancel: "cancelled", dispute: "disputed" },
  disputed: { release: "released", cancel: "cancelled" },
  released: {},
  cancelled: {},
};

export function transitionEscrow(record: EscrowRecord, action: EscrowAction): EscrowRecord {
  const next = transitions[record.state][action];
  if (!next) throw new Error(`action ${action} is not allowed from ${record.state}`);
  return { ...record, state: next };
}

export function canTransition(state: EscrowState, action: EscrowAction): boolean {
  return Boolean(transitions[state][action]);
}
