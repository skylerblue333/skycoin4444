export interface RateLimitPolicy {
  limit: number;
  windowMs: number;
}

export interface RateLimitEvent {
  subjectId: string;
  observedAtMs: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  used: number;
  remaining: number;
  retryAfterMs: number;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function validateRateLimitPolicy(policy: RateLimitPolicy): RateLimitPolicy {
  if (!Number.isSafeInteger(policy.limit) || policy.limit < 1) {
    throw new Error("invalid limit");
  }
  if (!Number.isSafeInteger(policy.windowMs) || policy.windowMs < 1) {
    throw new Error("invalid windowMs");
  }
  return { ...policy };
}

export function evaluateRateLimit(
  subjectId: string,
  events: readonly RateLimitEvent[],
  nowMs: number,
  policy: RateLimitPolicy
): RateLimitDecision {
  if (!ID.test(subjectId)) throw new Error("invalid subjectId");
  if (!Number.isSafeInteger(nowMs) || nowMs < 0) throw new Error("invalid nowMs");
  const checked = validateRateLimitPolicy(policy);
  const windowStart = nowMs - checked.windowMs;
  const matching = events
    .filter(event => event.subjectId === subjectId)
    .map(event => {
      if (!ID.test(event.subjectId)) throw new Error("invalid event subjectId");
      if (!Number.isSafeInteger(event.observedAtMs) || event.observedAtMs < 0) {
        throw new Error("invalid observedAtMs");
      }
      if (event.observedAtMs > nowMs) throw new Error("event is in the future");
      return event.observedAtMs;
    })
    .filter(observedAtMs => observedAtMs > windowStart)
    .sort((a, b) => a - b);

  const used = matching.length;
  const allowed = used < checked.limit;
  const remaining = Math.max(0, checked.limit - used);
  const retryAfterMs = allowed || used === 0 ? 0 : Math.max(1, matching[0] + checked.windowMs - nowMs + 1);
  return { allowed, used, remaining, retryAfterMs };
}
