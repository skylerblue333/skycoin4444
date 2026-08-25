export type CredentialStatus = "issued" | "revoked";

export interface EducationCredential {
  id: string;
  issuerId: string;
  subjectId: string;
  achievementId: string;
  issuedAtMs: number;
  expiresAtMs?: number;
  status: CredentialStatus;
  evidenceHash?: string;
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

export function createEducationCredential(input: unknown): EducationCredential {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("credential must be an object");
  }

  const value = input as Record<string, unknown>;
  const {
    id,
    issuerId,
    subjectId,
    achievementId,
    issuedAtMs,
    expiresAtMs,
    status,
    evidenceHash,
  } = value;

  if (
    !validId(id) ||
    !validId(issuerId) ||
    !validId(subjectId) ||
    !validId(achievementId)
  ) {
    throw new TypeError("credential identifiers must be safe identifiers");
  }

  if (!validTimestamp(issuedAtMs)) {
    throw new TypeError("issuedAtMs must be a non-negative safe integer");
  }

  if (expiresAtMs !== undefined) {
    if (!validTimestamp(expiresAtMs) || expiresAtMs <= issuedAtMs) {
      throw new RangeError("expiresAtMs must be after issuedAtMs");
    }
  }

  if (status !== "issued" && status !== "revoked") {
    throw new TypeError("unsupported credential status");
  }

  if (evidenceHash !== undefined) {
    if (typeof evidenceHash !== "string" || !HASH_PATTERN.test(evidenceHash)) {
      throw new TypeError("evidenceHash must be a 64-character hex digest");
    }
  }

  return {
    id,
    issuerId,
    subjectId,
    achievementId,
    issuedAtMs,
    ...(expiresAtMs === undefined ? {} : { expiresAtMs }),
    status,
    ...(evidenceHash === undefined ? {} : { evidenceHash }),
  };
}

export function isCredentialActive(
  credential: EducationCredential,
  nowMs: number
): boolean {
  if (!validTimestamp(nowMs)) {
    throw new TypeError("nowMs must be a non-negative safe integer");
  }

  if (credential.status !== "issued") return false;
  if (credential.issuedAtMs > nowMs) return false;
  if (credential.expiresAtMs !== undefined && credential.expiresAtMs <= nowMs) {
    return false;
  }
  return true;
}
