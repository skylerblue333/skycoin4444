export interface EntitlementGrant {
  subjectId: string;
  resource: string;
  action: string;
  expiresAtMs?: number;
}

export interface EntitlementRequest {
  subjectId: string;
  resource: string;
  action: string;
  nowMs: number;
}

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/;

function validateToken(value: string, name: string): void {
  if (!TOKEN.test(value)) throw new Error(`invalid ${name}`);
}

export function isEntitled(
  request: EntitlementRequest,
  grants: readonly EntitlementGrant[]
): boolean {
  validateToken(request.subjectId, "subjectId");
  validateToken(request.resource, "resource");
  validateToken(request.action, "action");
  if (!Number.isSafeInteger(request.nowMs) || request.nowMs < 0) {
    throw new Error("invalid nowMs");
  }

  return grants.some(grant => {
    validateToken(grant.subjectId, "grant subjectId");
    validateToken(grant.resource, "grant resource");
    validateToken(grant.action, "grant action");
    if (grant.expiresAtMs !== undefined) {
      if (!Number.isSafeInteger(grant.expiresAtMs) || grant.expiresAtMs < 0) {
        throw new Error("invalid expiresAtMs");
      }
      if (grant.expiresAtMs <= request.nowMs) return false;
    }
    return (
      grant.subjectId === request.subjectId &&
      grant.resource === request.resource &&
      grant.action === request.action
    );
  });
}
