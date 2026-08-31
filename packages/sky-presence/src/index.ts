export type PresenceStatus = "online" | "away" | "offline";

export interface PresenceHeartbeat {
  subjectId: string;
  observedAt: string;
  deviceId?: string;
}

export interface PresencePolicy {
  onlineWithinMs: number;
  awayWithinMs: number;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CANONICAL_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function validateHeartbeat(
  heartbeat: PresenceHeartbeat
): PresenceHeartbeat {
  if (!ID.test(heartbeat.subjectId)) throw new Error("invalid subjectId");
  if (heartbeat.deviceId !== undefined && !ID.test(heartbeat.deviceId)) {
    throw new Error("invalid deviceId");
  }
  parseCanonicalInstant(heartbeat.observedAt, "observedAt");
  return { ...heartbeat };
}

export function validatePresencePolicy(policy: PresencePolicy): PresencePolicy {
  if (
    !Number.isSafeInteger(policy.onlineWithinMs) ||
    policy.onlineWithinMs < 0
  ) {
    throw new Error("invalid onlineWithinMs");
  }
  if (
    !Number.isSafeInteger(policy.awayWithinMs) ||
    policy.awayWithinMs < policy.onlineWithinMs
  ) {
    throw new Error("invalid awayWithinMs");
  }
  return { ...policy };
}

export function derivePresence(
  heartbeat: PresenceHeartbeat | undefined,
  now: string,
  policy: PresencePolicy
): PresenceStatus {
  const nowMs = parseCanonicalInstant(now, "now");
  const checkedPolicy = validatePresencePolicy(policy);
  if (!heartbeat) return "offline";
  const checked = validateHeartbeat(heartbeat);
  const age = nowMs - parseCanonicalInstant(checked.observedAt, "observedAt");
  if (age < 0) throw new Error("heartbeat is in the future");
  if (age <= checkedPolicy.onlineWithinMs) return "online";
  if (age <= checkedPolicy.awayWithinMs) return "away";
  return "offline";
}

export function latestHeartbeat(
  heartbeats: readonly PresenceHeartbeat[]
): PresenceHeartbeat | undefined {
  let latest: PresenceHeartbeat | undefined;
  let latestMs = -1;
  for (const raw of heartbeats) {
    const heartbeat = validateHeartbeat(raw);
    const observedAtMs = parseCanonicalInstant(
      heartbeat.observedAt,
      "observedAt"
    );
    if (!latest || observedAtMs > latestMs) {
      latest = heartbeat;
      latestMs = observedAtMs;
    }
  }
  return latest;
}

function parseCanonicalInstant(value: string, field: string): number {
  if (typeof value !== "string" || !CANONICAL_INSTANT.test(value)) {
    throw new Error(`invalid ${field}`);
  }
  const milliseconds = Date.parse(value);
  if (
    !Number.isFinite(milliseconds) ||
    new Date(milliseconds).toISOString() !== value
  ) {
    throw new Error(`invalid ${field}`);
  }
  return milliseconds;
}
