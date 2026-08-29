export type ReturnStatus = "requested" | "approved" | "rejected" | "received" | "refunded";

export type ReturnRequest = {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  reason: string;
  status?: ReturnStatus;
};

export type ReturnDecision = {
  type: "sky.returns.decision.v1";
  returnId: string;
  status: "approved" | "rejected";
  reason?: string;
};

const RETURN_STATUSES = new Set<ReturnStatus>(["requested", "approved", "rejected", "received", "refunded"]);

const clean = (value: string, field: string, max: number): string => {
  const result = value.trim();
  if (!result) throw new Error(`${field} is required`);
  if (result.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return result;
};

const normalizeStatus = (value: unknown): ReturnStatus => {
  const status = value === undefined ? "requested" : value;
  if (typeof status !== "string" || !RETURN_STATUSES.has(status as ReturnStatus)) {
    throw new Error("status must be one of requested, approved, rejected, received, refunded");
  }
  return status as ReturnStatus;
};

export function normalizeReturnRequest(input: ReturnRequest): Required<ReturnRequest> {
  const quantity = input.quantity;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
    throw new Error("quantity must be an integer between 1 and 10000");
  }
  return {
    id: clean(input.id, "return id", 160),
    orderId: clean(input.orderId, "orderId", 160),
    itemId: clean(input.itemId, "itemId", 160),
    quantity,
    reason: clean(input.reason, "reason", 1000),
    status: normalizeStatus(input.status),
  };
}

const ALLOWED: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ["approved", "rejected"],
  approved: ["received"],
  rejected: [],
  received: ["refunded"],
  refunded: [],
};

export function transitionReturn(request: ReturnRequest, next: ReturnStatus): Required<ReturnRequest> {
  const current = normalizeReturnRequest(request);
  if (!ALLOWED[current.status].includes(next)) {
    throw new Error(`invalid return transition: ${current.status} -> ${next}`);
  }
  return { ...current, status: next };
}

export function createReturnDecision(request: ReturnRequest, approved: boolean, reason?: string): ReturnDecision {
  const normalized = normalizeReturnRequest(request);
  if (normalized.status !== "requested") {
    throw new Error("return decisions can only be created from requested status");
  }
  const decisionReason = reason?.trim();
  if (!approved && !decisionReason) throw new Error("rejection reason is required");
  return {
    type: "sky.returns.decision.v1",
    returnId: normalized.id,
    status: approved ? "approved" : "rejected",
    ...(decisionReason ? { reason: clean(decisionReason, "decision reason", 1000) } : {}),
  };
}
