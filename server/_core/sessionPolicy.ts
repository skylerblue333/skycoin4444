const MIN_SESSION_TTL_MS = 15 * 60 * 1_000;
const DEFAULT_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1_000;
const MAX_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1_000;

export type SessionLifetimePolicy = Readonly<{
  ttlMs: number;
  minTtlMs: number;
  maxTtlMs: number;
  serverSideRevocationBacked: false;
}>;

export function validateSessionTtlMs(
  value: number,
  label = "SESSION_TTL_MS"
): number {
  if (
    !Number.isSafeInteger(value) ||
    value < MIN_SESSION_TTL_MS ||
    value > MAX_SESSION_TTL_MS
  ) {
    throw new RangeError(
      label +
        " must be an integer between " +
        MIN_SESSION_TTL_MS +
        " and " +
        MAX_SESSION_TTL_MS
    );
  }
  return value;
}

export function sessionLifetimePolicyFromEnv(
  env: NodeJS.ProcessEnv = process.env
): SessionLifetimePolicy {
  const raw = env.SESSION_TTL_MS?.trim();
  if (raw && !/^\d+$/.test(raw)) {
    throw new RangeError(
      "SESSION_TTL_MS must contain decimal digits only"
    );
  }
  const ttlMs = raw
    ? validateSessionTtlMs(Number(raw))
    : DEFAULT_SESSION_TTL_MS;

  return Object.freeze({
    ttlMs,
    minTtlMs: MIN_SESSION_TTL_MS,
    maxTtlMs: MAX_SESSION_TTL_MS,
    serverSideRevocationBacked: false as const,
  });
}

export function resolveSessionTtlMs(
  requestedMs: number | undefined,
  env: NodeJS.ProcessEnv = process.env
): number {
  if (requestedMs === undefined) {
    return sessionLifetimePolicyFromEnv(env).ttlMs;
  }
  return validateSessionTtlMs(requestedMs, "expiresInMs");
}
