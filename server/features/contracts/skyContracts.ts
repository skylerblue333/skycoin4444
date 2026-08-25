export type ContractStatus = "draft" | "active" | "terminated" | "expired";

export interface ContractRecord {
  id: string;
  organizationId: string;
  counterpartyId: string;
  title: string;
  effectiveAtMs: number;
  expiresAtMs?: number;
  status: ContractStatus;
  documentHash?: string;
}

const ID_PATTERN = /^[A-Za-z0-9._:@/-]+$/;
const HASH_PATTERN = /^[A-Fa-f0-9]{64}$/;

function validId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 160 &&
    ID_PATTERN.test(value)
  );
}

function validTimestamp(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

export function createContractRecord(input: unknown): ContractRecord {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("contract must be an object");
  }

  const value = input as Record<string, unknown>;
  const {
    id,
    organizationId,
    counterpartyId,
    title,
    effectiveAtMs,
    expiresAtMs,
    status,
    documentHash,
  } = value;

  if (!validId(id) || !validId(organizationId) || !validId(counterpartyId)) {
    throw new TypeError("contract identifiers must be safe identifiers");
  }

  if (typeof title !== "string" || title.trim().length < 1 || title.length > 240) {
    throw new TypeError("title must contain 1 to 240 characters");
  }

  if (!validTimestamp(effectiveAtMs)) {
    throw new TypeError("effectiveAtMs must be a non-negative safe integer");
  }

  if (expiresAtMs !== undefined) {
    if (!validTimestamp(expiresAtMs) || expiresAtMs <= effectiveAtMs) {
      throw new RangeError("expiresAtMs must be after effectiveAtMs");
    }
  }

  if (
    status !== "draft" &&
    status !== "active" &&
    status !== "terminated" &&
    status !== "expired"
  ) {
    throw new TypeError("unsupported contract status");
  }

  if (documentHash !== undefined) {
    if (typeof documentHash !== "string" || !HASH_PATTERN.test(documentHash)) {
      throw new TypeError("documentHash must be a 64-character hex digest");
    }
  }

  return {
    id,
    organizationId,
    counterpartyId,
    title: title.trim(),
    effectiveAtMs,
    ...(expiresAtMs === undefined ? {} : { expiresAtMs }),
    status,
    ...(documentHash === undefined ? {} : { documentHash }),
  };
}

export function isContractInForce(
  contract: ContractRecord,
  nowMs: number
): boolean {
  if (!validTimestamp(nowMs)) {
    throw new TypeError("nowMs must be a non-negative safe integer");
  }

  if (contract.status !== "active") return false;
  if (contract.effectiveAtMs > nowMs) return false;
  if (contract.expiresAtMs !== undefined && contract.expiresAtMs <= nowMs) {
    return false;
  }
  return true;
}
