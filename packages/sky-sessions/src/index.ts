export type SessionStatus = "active" | "expired" | "revoked";

export interface SessionPolicy {
  absoluteTtlMs: number;
  idleTtlMs: number;
  maxSessionsPerUser: number;
}

export interface SessionRecord {
  id: string;
  userId: string;
  deviceId: string;
  createdAt: number;
  lastSeenAt: number;
  expiresAt: number;
  revokedAt: number | null;
  revokeReason: string | null;
}

export interface SessionAuthContext {
  sessionId: string;
  userId: string;
  deviceId: string;
  status: SessionStatus;
}

export interface SessionAuditEvent {
  type: "session.created" | "session.touched" | "session.revoked";
  sessionId: string;
  userId: string;
  occurredAt: number;
  reason?: string;
}

export interface SessionStore {
  get(id: string): SessionRecord | undefined;
  listByUser(userId: string): SessionRecord[];
  save(record: SessionRecord): void;
}

export class InMemorySessionStore implements SessionStore {
  private readonly records = new Map<string, SessionRecord>();

  get(id: string): SessionRecord | undefined {
    const record = this.records.get(id);
    return record ? { ...record } : undefined;
  }

  listByUser(userId: string): SessionRecord[] {
    return [...this.records.values()]
      .filter(record => record.userId === userId)
      .map(record => ({ ...record }));
  }

  save(record: SessionRecord): void {
    this.records.set(record.id, { ...record });
  }
}

export interface SessionServiceOptions {
  policy: SessionPolicy;
  store?: SessionStore;
  now?: () => number;
  idFactory?: () => string;
  onAuditEvent?: (event: SessionAuditEvent) => void;
}

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const REASON_MAX_LENGTH = 256;

export class SessionService {
  private readonly policy: SessionPolicy;
  private readonly store: SessionStore;
  private readonly now: () => number;
  private readonly idFactory: () => string;
  private readonly onAuditEvent?: (event: SessionAuditEvent) => void;

  constructor(options: SessionServiceOptions) {
    validatePolicy(options.policy);
    this.policy = { ...options.policy };
    this.store = options.store ?? new InMemorySessionStore();
    this.now = options.now ?? Date.now;
    this.idFactory = options.idFactory ?? (() => `sess_${Math.random().toString(36).slice(2, 18)}`);
    this.onAuditEvent = options.onAuditEvent;
  }

  create(input: { userId: string; deviceId: string }): SessionRecord {
    const userId = validateIdentifier("userId", input.userId);
    const deviceId = validateIdentifier("deviceId", input.deviceId);
    const now = this.now();
    const active = this.store
      .listByUser(userId)
      .filter(record => this.evaluate(record, now) === "active")
      .sort((a, b) => a.createdAt - b.createdAt);

    if (active.length >= this.policy.maxSessionsPerUser) {
      throw new Error("session_limit_reached");
    }

    const id = validateIdentifier("sessionId", this.idFactory());
    if (this.store.get(id)) {
      throw new Error("session_id_collision");
    }

    const record: SessionRecord = {
      id,
      userId,
      deviceId,
      createdAt: now,
      lastSeenAt: now,
      expiresAt: now + this.policy.absoluteTtlMs,
      revokedAt: null,
      revokeReason: null,
    };
    this.store.save(record);
    this.emit({ type: "session.created", sessionId: id, userId, occurredAt: now });
    return { ...record };
  }

  get(sessionId: string): SessionRecord | undefined {
    return this.store.get(validateIdentifier("sessionId", sessionId));
  }

  list(userId: string): SessionRecord[] {
    return this.store.listByUser(validateIdentifier("userId", userId));
  }

  touch(sessionId: string): SessionRecord {
    const record = this.require(sessionId);
    const now = this.now();
    if (this.evaluate(record, now) !== "active") {
      throw new Error("session_not_active");
    }
    const next = { ...record, lastSeenAt: now };
    this.store.save(next);
    this.emit({ type: "session.touched", sessionId: next.id, userId: next.userId, occurredAt: now });
    return { ...next };
  }

  revoke(sessionId: string, reason = "user_requested"): SessionRecord {
    const record = this.require(sessionId);
    const cleanReason = validateReason(reason);
    if (record.revokedAt !== null) return record;

    const now = this.now();
    const next = { ...record, revokedAt: now, revokeReason: cleanReason };
    this.store.save(next);
    this.emit({
      type: "session.revoked",
      sessionId: next.id,
      userId: next.userId,
      occurredAt: now,
      reason: cleanReason,
    });
    return { ...next };
  }

  revokeAllExcept(userId: string, keepSessionId?: string): number {
    const validUserId = validateIdentifier("userId", userId);
    const keep = keepSessionId ? validateIdentifier("sessionId", keepSessionId) : undefined;
    let revoked = 0;
    for (const record of this.store.listByUser(validUserId)) {
      if (record.id === keep || this.evaluate(record) !== "active") continue;
      this.revoke(record.id, "bulk_revoke");
      revoked += 1;
    }
    return revoked;
  }

  status(sessionId: string): SessionStatus {
    return this.evaluate(this.require(sessionId));
  }

  toAuthContext(sessionId: string): SessionAuthContext {
    const record = this.require(sessionId);
    return {
      sessionId: record.id,
      userId: record.userId,
      deviceId: record.deviceId,
      status: this.evaluate(record),
    };
  }

  private evaluate(record: SessionRecord, at = this.now()): SessionStatus {
    if (record.revokedAt !== null) return "revoked";
    if (at >= record.expiresAt || at - record.lastSeenAt >= this.policy.idleTtlMs) return "expired";
    return "active";
  }

  private require(sessionId: string): SessionRecord {
    const id = validateIdentifier("sessionId", sessionId);
    const record = this.store.get(id);
    if (!record) throw new Error("session_not_found");
    return record;
  }

  private emit(event: SessionAuditEvent): void {
    this.onAuditEvent?.({ ...event });
  }
}

function validateIdentifier(name: string, value: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) {
    throw new Error(`invalid_${name}`);
  }
  return value;
}

function validateReason(value: string): string {
  const reason = value.trim();
  if (!reason || reason.length > REASON_MAX_LENGTH || /[\u0000-\u001F\u007F]/.test(reason)) {
    throw new Error("invalid_revoke_reason");
  }
  return reason;
}

function validatePolicy(policy: SessionPolicy): void {
  const positiveInteger = (value: number) => Number.isSafeInteger(value) && value > 0;
  if (!positiveInteger(policy.absoluteTtlMs)) throw new Error("invalid_absolute_ttl");
  if (!positiveInteger(policy.idleTtlMs)) throw new Error("invalid_idle_ttl");
  if (!positiveInteger(policy.maxSessionsPerUser) || policy.maxSessionsPerUser > 1000) {
    throw new Error("invalid_max_sessions");
  }
  if (policy.idleTtlMs > policy.absoluteTtlMs) throw new Error("idle_ttl_exceeds_absolute_ttl");
}
