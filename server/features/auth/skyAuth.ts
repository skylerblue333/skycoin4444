export type AuthMethod = "oauth" | "password" | "passkey" | "service";

export interface VerifiedSessionClaims {
  subject: string;
  sessionId: string;
  issuedAtMs: number;
  expiresAtMs: number;
  authMethod: AuthMethod;
}

export interface AuthPrincipal {
  subject: string;
  sessionId: string;
  authMethod: AuthMethod;
  authenticatedAtMs: number;
  expiresAtMs: number;
}

export type AuthDecision =
  | { ok: true; principal: AuthPrincipal }
  | { ok: false; code: "invalid_claims" | "expired" | "not_yet_valid"; reason: string };

const MAX_ID_LENGTH = 160;
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;
const MAX_SESSION_LIFETIME_MS = 366 * 24 * 60 * 60 * 1000;
const AUTH_METHODS: ReadonlySet<string> = new Set(["oauth", "password", "passkey", "service"]);

function isSafeIdentifier(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_ID_LENGTH &&
    /^[A-Za-z0-9._:@/-]+$/.test(value)
  );
}

function isFiniteInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

/**
 * Converts claims that have already been cryptographically verified by an upstream
 * session/token verifier into a narrow SKYCOIN4444 authentication principal.
 *
 * This function deliberately does NOT verify signatures, passwords, OAuth codes,
 * passkeys, or external identity providers. It is a deterministic policy boundary.
 */
export function authenticateVerifiedSession(input: unknown, nowMs: number = Date.now()): AuthDecision {
  if (!isFiniteInteger(nowMs)) {
    throw new TypeError("nowMs must be a non-negative safe integer");
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, code: "invalid_claims", reason: "claims must be an object" };
  }

  const claims = input as Record<string, unknown>;
  const { subject, sessionId, issuedAtMs, expiresAtMs, authMethod } = claims;

  if (!isSafeIdentifier(subject) || !isSafeIdentifier(sessionId)) {
    return { ok: false, code: "invalid_claims", reason: "subject and sessionId must be safe identifiers" };
  }

  if (!isFiniteInteger(issuedAtMs) || !isFiniteInteger(expiresAtMs) || expiresAtMs <= issuedAtMs) {
    return { ok: false, code: "invalid_claims", reason: "session timestamps are invalid" };
  }

  if (expiresAtMs - issuedAtMs > MAX_SESSION_LIFETIME_MS) {
    return { ok: false, code: "invalid_claims", reason: "session lifetime exceeds policy maximum" };
  }

  if (typeof authMethod !== "string" || !AUTH_METHODS.has(authMethod)) {
    return { ok: false, code: "invalid_claims", reason: "authMethod is unsupported" };
  }

  if (issuedAtMs > nowMs + MAX_CLOCK_SKEW_MS) {
    return { ok: false, code: "not_yet_valid", reason: "session was issued too far in the future" };
  }

  if (expiresAtMs <= nowMs) {
    return { ok: false, code: "expired", reason: "session has expired" };
  }

  return {
    ok: true,
    principal: {
      subject,
      sessionId,
      authMethod: authMethod as AuthMethod,
      authenticatedAtMs: issuedAtMs,
      expiresAtMs,
    },
  };
}

export const skyAuthPolicy = Object.freeze({
  maxIdentifierLength: MAX_ID_LENGTH,
  maxClockSkewMs: MAX_CLOCK_SKEW_MS,
  maxSessionLifetimeMs: MAX_SESSION_LIFETIME_MS,
});
