import { describe, expect, it } from "vitest";
import { createEventPublishedContract } from "../../packages/sky-events/src/index";
import { createAuditRecord, redactAuditMetadata } from "../../packages/sky-audit/src/index";

describe("post-Wave-2 integration smoke", () => {
  it("hands a normalized SkyEvents contract into the SkyAudit boundary deterministically", () => {
    const published = createEventPublishedContract({
      id: " evt-001 ",
      type: " identity.session.created ",
      actorId: " user-42 ",
      subjectId: " session-7 ",
      occurredAt: "2026-08-30T20:00:00-05:00",
      payload: { source: "release-smoke", token: "must-not-be-copied" },
    });

    expect(published).toEqual({
      type: "sky.events.published.v1",
      event: {
        id: "evt-001",
        type: "identity.session.created",
        actorId: "user-42",
        subjectId: "session-7",
        occurredAt: "2026-08-31T01:00:00.000Z",
        payload: { source: "release-smoke", token: "must-not-be-copied" },
      },
    });

    const safeMetadata = redactAuditMetadata({
      eventContract: published.type,
      eventId: published.event.id,
      token: String(published.event.payload?.token),
    });

    const audit = createAuditRecord({
      actorId: published.event.actorId!,
      action: published.event.type,
      resource: published.event.subjectId!,
      occurredAt: published.event.occurredAt,
      metadata: safeMetadata as Record<string, string | number | boolean>,
    });

    expect(audit.actorId).toBe("user-42");
    expect(audit.action).toBe("identity.session.created");
    expect(audit.resource).toBe("session-7");
    expect(audit.occurredAt).toBe("2026-08-31T01:00:00.000Z");
    expect(audit.metadata).toEqual({
      eventContract: "sky.events.published.v1",
      eventId: "evt-001",
      token: "[REDACTED]",
    });

    const replay = createAuditRecord({
      actorId: published.event.actorId!,
      action: published.event.type,
      resource: published.event.subjectId!,
      occurredAt: published.event.occurredAt,
      metadata: safeMetadata as Record<string, string | number | boolean>,
    });
    expect(replay.id).toBe(audit.id);
    expect(replay.canonical).toBe(audit.canonical);
  });

  it("fails closed when the producer contract carries an invalid event instant", () => {
    expect(() =>
      createEventPublishedContract({
        id: "evt-invalid",
        type: "identity.session.created",
        actorId: "user-42",
        occurredAt: "not-an-instant",
      }),
    ).toThrow(/occurredAt/);
  });
});
