/**
 * Ported from skylerblue333/Sky-SkyEnterprise at
 * d64edb7f7787393229de99cd9393e4542fecc490 (MIT).
 */
export type ContractStatus = "draft" | "active" | "ended" | "cancelled";

const ID_RE = /^[A-Za-z0-9._:-]{1,96}$/;
const MAX_PARTIES = 32;
const MAX_CONTRACTS = 10_000;

export interface ContractInput {
  id: string;
  organizationId: string;
  title: string;
  partyIds: string[];
  effectiveAt?: number;
  expiresAt?: number;
}

export interface ContractSnapshot {
  readonly id: string;
  readonly organizationId: string;
  readonly title: string;
  readonly partyIds: readonly string[];
  readonly status: ContractStatus;
  readonly effectiveAt: number | undefined;
  readonly expiresAt: number | undefined;
  readonly legalValidityVerified: false;
  readonly signaturePerformed: false;
}

export interface OrganizationContractMembershipLookup {
  roleOf(userId: string): "owner" | "admin" | "member" | undefined;
}

function safeId(name: string, value: string): string {
  const normalized = value.trim();
  if (!ID_RE.test(normalized)) throw new Error(`invalid ${name}`);
  return normalized;
}

function timestamp(name: string, value?: number): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`invalid ${name}`);
  }
  return value;
}

function normalize(input: ContractInput): ContractSnapshot {
  const title = input.title.trim();
  if (title.length < 1 || title.length > 160) {
    throw new Error("invalid contract title");
  }
  if (
    !Array.isArray(input.partyIds) ||
    input.partyIds.length < 2 ||
    input.partyIds.length > MAX_PARTIES
  ) {
    throw new Error(`partyIds must contain 2-${MAX_PARTIES} entries`);
  }
  const partyIds = input.partyIds.map((value) => safeId("party id", value));
  if (new Set(partyIds).size !== partyIds.length) {
    throw new Error("duplicate party id");
  }
  const effectiveAt = timestamp("effectiveAt", input.effectiveAt);
  const expiresAt = timestamp("expiresAt", input.expiresAt);
  if (
    effectiveAt !== undefined &&
    expiresAt !== undefined &&
    expiresAt <= effectiveAt
  ) {
    throw new Error("expiresAt must be after effectiveAt");
  }
  return Object.freeze({
    id: safeId("contract id", input.id),
    organizationId: safeId("organization id", input.organizationId),
    title,
    partyIds: Object.freeze([...partyIds]),
    status: "draft" as const,
    effectiveAt,
    expiresAt,
    legalValidityVerified: false as const,
    signaturePerformed: false as const,
  });
}

function clone(record: ContractSnapshot): ContractSnapshot {
  return Object.freeze({
    ...record,
    partyIds: Object.freeze([...record.partyIds]),
  });
}

export class ContractRegistry {
  readonly #contracts = new Map<string, ContractSnapshot>();

  create(input: ContractInput): ContractSnapshot {
    if (this.#contracts.size >= MAX_CONTRACTS) {
      throw new Error("contract capacity reached");
    }
    const record = normalize(input);
    if (this.#contracts.has(record.id)) {
      throw new Error("contract id already exists");
    }
    this.#contracts.set(record.id, record);
    return clone(record);
  }

  transition(id: string, nextStatus: ContractStatus): ContractSnapshot {
    const normalizedId = safeId("contract id", id);
    const current = this.#contracts.get(normalizedId);
    if (!current) throw new Error("contract not found");
    if (!allowedTransition(current.status, nextStatus)) {
      throw new Error("invalid contract status transition");
    }
    const updated = Object.freeze({ ...current, status: nextStatus });
    this.#contracts.set(normalizedId, updated);
    return clone(updated);
  }

  get(id: string): ContractSnapshot | undefined {
    const record = this.#contracts.get(safeId("contract id", id));
    return record ? clone(record) : undefined;
  }

  listForOrganization(organizationId: string): ContractSnapshot[] {
    const normalized = safeId("organization id", organizationId);
    return [...this.#contracts.values()]
      .filter((item) => item.organizationId === normalized)
      .sort((left, right) => left.id.localeCompare(right.id))
      .map(clone);
  }
}

function allowedTransition(
  current: ContractStatus,
  next: ContractStatus,
): boolean {
  if (current === next) return true;
  if (current === "draft") return next === "active" || next === "cancelled";
  if (current === "active") return next === "ended" || next === "cancelled";
  return false;
}

export function createContractForOrganization(
  registry: ContractRegistry,
  organization: OrganizationContractMembershipLookup,
  actorId: string,
  input: ContractInput,
): ContractSnapshot {
  const role = organization.roleOf(actorId);
  if (role !== "owner" && role !== "admin") {
    throw new Error("organization admin role required");
  }
  return registry.create(input);
}
