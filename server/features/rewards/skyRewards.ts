export type RewardReason = "earn" | "redeem" | "adjustment";

export interface RewardEntry {
  id: string;
  accountId: string;
  points: number;
  reason: RewardReason;
  createdAtMs: number;
}

export interface RewardBalance {
  accountId: string;
  availablePoints: number;
}

const MAX_POINTS_DELTA = 1_000_000_000;
const ID_PATTERN = /^[A-Za-z0-9._:@/-]+$/;

function validId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 160 &&
    ID_PATTERN.test(value)
  );
}

function validInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

export function createRewardEntry(input: unknown): RewardEntry {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("reward entry must be an object");
  }

  const value = input as Record<string, unknown>;
  const { id, accountId, points, reason, createdAtMs } = value;

  if (!validId(id) || !validId(accountId)) {
    throw new TypeError("id and accountId must be safe identifiers");
  }

  if (
    !validInteger(points) ||
    points === 0 ||
    Math.abs(points) > MAX_POINTS_DELTA
  ) {
    throw new RangeError("points must be a bounded non-zero safe integer");
  }

  if (reason !== "earn" && reason !== "redeem" && reason !== "adjustment") {
    throw new TypeError("unsupported reward reason");
  }

  if (!validInteger(createdAtMs) || createdAtMs < 0) {
    throw new TypeError("createdAtMs must be a non-negative safe integer");
  }

  if (reason === "earn" && points < 0) {
    throw new RangeError("earn entries must add points");
  }

  if (reason === "redeem" && points > 0) {
    throw new RangeError("redeem entries must subtract points");
  }

  return { id, accountId, points, reason, createdAtMs };
}

export function calculateRewardBalance(
  accountId: string,
  entries: readonly RewardEntry[]
): RewardBalance {
  if (!validId(accountId)) {
    throw new TypeError("accountId must be a safe identifier");
  }

  let availablePoints = 0;
  const seen = new Set<string>();

  for (const entry of entries) {
    if (entry.accountId !== accountId) continue;
    if (seen.has(entry.id)) {
      throw new Error(`duplicate reward entry: ${entry.id}`);
    }
    seen.add(entry.id);

    availablePoints += entry.points;
    if (!Number.isSafeInteger(availablePoints) || availablePoints < 0) {
      throw new RangeError("reward balance cannot become negative or unsafe");
    }
  }

  return { accountId, availablePoints };
}
