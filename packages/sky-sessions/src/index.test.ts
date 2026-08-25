import { describe, expect, it } from "vitest";
import {
  InMemorySessionStore,
  SessionService,
  type SessionAuditEvent,
} from "./index";

function fixture() {
  let now = 1_000;
  let sequence = 0;
  const events: SessionAuditEvent[] = [];
  const service = new SessionService({
    policy: {
      absoluteTtlMs: 10_000,
      idleTtlMs: 1_000,
      maxSessionsPerUser: 2,
    },
    store: new InMemorySessionStore(),
    now: () => now,
    idFactory: () => `sess_${++sequence}`,
    onAuditEvent: event => events.push(event),
  });
  return {
    service,
    events,
    advance(ms: number) {
      now += ms;
    },
  };
}

describe("SkySessions domain core", () => {
  it("creates, touches, and exposes a minimal auth integration context", () => {
    const { service, advance, events } = fixture();
    const session = service.create({
      userId: "user_1",
      deviceId: "device_phone",
    });
    advance(500);
    const touched = service.touch(session.id);

    expect(touched.lastSeenAt).toBe(1_500);
    expect(service.toAuthContext(session.id)).toEqual({
      sessionId: "sess_1",
      userId: "user_1",
      deviceId: "device_phone",
      status: "active",
    });
    expect(events.map(event => event.type)).toEqual([
      "session.created",
      "session.touched",
    ]);
  });

  it("expires sessions by idle timeout and rejects stale touches", () => {
    const { service, advance } = fixture();
    const session = service.create({
      userId: "user_1",
      deviceId: "device_phone",
    });
    advance(1_000);

    expect(service.status(session.id)).toBe("expired");
    expect(() => service.touch(session.id)).toThrow("session_not_active");
  });

  it("enforces per-user concurrency and supports bulk revocation", () => {
    const { service } = fixture();
    const first = service.create({
      userId: "user_1",
      deviceId: "device_a",
    });
    const second = service.create({
      userId: "user_1",
      deviceId: "device_b",
    });

    expect(() =>
      service.create({ userId: "user_1", deviceId: "device_c" })
    ).toThrow("session_limit_reached");
    expect(service.revokeAllExcept("user_1", second.id)).toBe(1);
    expect(service.status(first.id)).toBe("revoked");
    expect(service.status(second.id)).toBe("active");
  });

  it("validates caller-controlled identifiers, policies, and revoke reasons", () => {
    const { service } = fixture();
    expect(() =>
      service.create({ userId: "bad user", deviceId: "device" })
    ).toThrow("invalid_userId");
    const session = service.create({
      userId: "user_1",
      deviceId: "device",
    });
    expect(() => service.revoke(session.id, "bad\nreason")).toThrow(
      "invalid_revoke_reason"
    );
    expect(
      () =>
        new SessionService({
          policy: {
            absoluteTtlMs: 100,
            idleTtlMs: 200,
            maxSessionsPerUser: 1,
          },
        })
    ).toThrow("idle_ttl_exceeds_absolute_ttl");
  });

  it("does not leak mutable store references", () => {
    const { service } = fixture();
    const session = service.create({
      userId: "user_1",
      deviceId: "device",
    });
    session.userId = "attacker";
    expect(service.get("sess_1")?.userId).toBe("user_1");
  });
});
