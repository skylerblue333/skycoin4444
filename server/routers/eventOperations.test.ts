import { describe, expect, it } from "vitest";
import {
  buildDeadLetterReplayAuditDetails,
  buildDeadLetterReplayPatch,
  eventOperationsRouter,
  toDeadLetterSummary,
} from "./eventOperations";

describe("dead-letter operations authorization", () => {
  it("rejects non-admin callers before querying dead letters", async () => {
    const caller = eventOperationsRouter.createCaller({
      req: {} as never,
      res: {} as never,
      requestId: "request-1",
      user: {
        id: "user-1",
        role: "user",
      } as never,
    });

    await expect(
      caller.deadLetters({ limit: 1 })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects signed-out callers before querying dead letters", async () => {
    const caller = eventOperationsRouter.createCaller({
      req: {} as never,
      res: {} as never,
      requestId: "request-2",
      user: null,
    });

    await expect(
      caller.deadLetters({ limit: 1 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("dead-letter operations redaction", () => {
  it("returns metadata only and cannot expose payload or raw errors", () => {
    const summary = toDeadLetterSummary({
      id: "event-1",
      eventType: "social.post.created",
      schemaVersion: 1,
      producer: "skycoin4444.social",
      aggregateType: "social.post",
      aggregateId: "post-1",
      attempts: 8,
      availableAt: new Date("2026-09-04T14:00:00.000Z"),
      createdAt: new Date("2026-09-04T13:00:00.000Z"),
    });

    expect(summary).toEqual({
      id: "event-1",
      eventType: "social.post.created",
      schemaVersion: 1,
      producer: "skycoin4444.social",
      aggregateType: "social.post",
      aggregateId: "post-1",
      attempts: 8,
      availableAt: "2026-09-04T14:00:00.000Z",
      createdAt: "2026-09-04T13:00:00.000Z",
    });
    expect("payload" in summary).toBe(false);
    expect("lastError" in summary).toBe(false);
  });

  it("builds a fresh bounded retry state and clears stale lease/error state", () => {
    const now = new Date("2026-09-04T15:00:00.000Z");

    expect(buildDeadLetterReplayPatch(now)).toEqual({
      state: "retry",
      attempts: 0,
      availableAt: now,
      leasedUntil: null,
      leaseOwner: null,
      publishedAt: null,
      lastError: null,
    });
  });

  it("hashes the operator reason before durable audit storage", () => {
    const reason = "retry after dependency recovery";
    const details = buildDeadLetterReplayAuditDetails({
      eventId: "event-2",
      eventType: "beta.feedback.submitted",
      previousAttempts: 8,
      reason,
    });

    expect(details).not.toContain(reason);
    const parsed = JSON.parse(details) as {
      eventId: string;
      eventType: string;
      previousAttempts: number;
      reasonDigest: string;
    };
    expect(parsed).toMatchObject({
      eventId: "event-2",
      eventType: "beta.feedback.submitted",
      previousAttempts: 8,
    });
    expect(parsed.reasonDigest).toMatch(/^[a-f0-9]{64}$/);
  });
});
