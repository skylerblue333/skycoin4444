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

export function validateHeartbeat(heartbeat: PresenceHeartbeat): PresenceHeartbeat {
  if (!ID.test(heartbeat.subjectId)) throw new Error("invalid subjectId");
  if (heartbeat.deviceId !== undefined && !ID.test(heartbeat.deviceId)) throw new Error("invalid deviceId");
  if (!Number.isFinite(Date.parse(heartbeat.observedAt))) throw new Error("invalid observedAt");
  return { ...heartbeat };
}

export function validatePresencePolicy(policy: PresencePolicy): PresencePolicy {
  if (!Number.isSafeInteger(policy.onlineWithinMs) || policy.onlineWithinMs < 0) throw new Error("invalid onlineWithinMs");
  if (!Number.isSafeInteger(policy.awayWithinMs) || policy.awayWithinMs < policy.onlineWithinMs) throw new Error("invalid awayWithinMs");
  return { ...policy };
}

export function derivePresence(
  heartbeat: PresenceHeartbeat | undefined,
  now: string,
  policy: PresencePolicy,
): PresenceStatus {
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) throw new Error("invalid now");
  const checkedPolicy = validatePresencePolicy(policy);
  if (!heartbeat) return "offline";
  const checked = validateHeartbeat(heartbeat);
  const age = nowMs - Date.parse(checked.observedAt);
  if (age < 0) throw new Error("heartbeat is in the future");
  if (age <= checkedPolicy.onlineWithinMs) return "online";
  if (age <= checkedPolicy.awayWithinMs) return "away";
  return "offline";
}

export function latestHeartbeat(heartbeats: readonly PresenceHeartbeat[]): PresenceHeartbeat | undefined {
  let latest: PresenceHeartbeat | undefined;
  for (const raw of heartbeats) {
    const heartbeat = validateHeartbeat(raw);
    if (!latest || Date.parse(heartbeat.observedAt) > Date.parse(latest.observedAt)) latest = heartbeat;
  }
  return latest;
}
