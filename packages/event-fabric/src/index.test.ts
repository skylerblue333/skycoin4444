import { describe, expect, it } from "vitest";
import {
  MAX_EVENT_PAYLOAD_BYTES,
  canonicalJson,
  compileEventRegistry,
  createDomainEvent,
  decideIdempotency,
  hashIdempotencyRequest,
  payloadHash,
  planOutboxFailure,
  toOutboxRow,
} from "./index";

describe("event registry", () => {
  it("fingerprints equivalent registries deterministically", () => {
    const descriptors = [
      {
        eventType: "social.post.created",
        currentVersion: 1,
        owner: "social",
        description: "A bounded social post was persisted",
        classification: "internal" as const,
      },
      {
        eventType: "beta.feedback.submitted",
        currentVersion: 1,
        owner: "beta-feedback",
        description: "Engineering beta feedback was persisted",
        classification: "sensitive" as const,
      },
    ];

    const first = compileEventRegistry(descriptors);
    const second = compileEventRegistry([...descriptors].reverse());

    expect(first.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(first.fingerprint).toBe(second.fingerprint);
  });
});

describe("domain event envelope", () => {
  it("canonicalizes payloads and produces deterministic hashes", () => {
    const left = { z: 1, a: { y: true, b: "x" } };
    const right = { a: { b: "x", y: true }, z: 1 };

    expect(canonicalJson(left)).toBe(canonicalJson(right));
    expect(payloadHash(left)).toBe(payloadHash(right));
  });

  it("creates a bounded envelope and storage row", () => {
    const event = createDomainEvent(
      {
        eventType: "social.post.created",
        schemaVersion: 1,
        producer: "skycoin4444.social",
        aggregate: { type: "social.post", id: "post-1" },
        correlationId: "request-1",
        actorId: "user-1",
        payload: { postId: "post-1", hasMedia: false },
        metadata: { source: "trpc" },
      },
      {
        idFactory: () => "event-1",
        clock: () => new Date("2026-09-04T00:00:00.000Z"),
      }
    );

    expect(event.eventId).toBe("event-1");
    expect(event.occurredAt).toBe("2026-09-04T00:00:00.000Z");

    const row = toOutboxRow(event);
    expect(row.state).toBe("pending");
    expect(row.attempts).toBe(0);
    expect(JSON.parse(row.payload)).toEqual({
      hasMedia: false,
      postId: "post-1",
    });
  });

  it("rejects payloads that exceed the durable TEXT boundary", () => {
    expect(() =>
      createDomainEvent({
        eventType: "social.post.created",
        schemaVersion: 1,
        producer: "skycoin4444.social",
        aggregate: { type: "social.post", id: "post-1" },
        correlationId: "request-1",
        payload: { value: "x".repeat(MAX_EVENT_PAYLOAD_BYTES + 1) },
      })
    ).toThrow(/payload exceeds/i);
  });
});

describe("idempotency contract", () => {
  it("hashes equivalent requests identically", () => {
    expect(
      hashIdempotencyRequest("post:create", { b: 2, a: 1 })
    ).toBe(hashIdempotencyRequest("post:create", { a: 1, b: 2 }));
  });

  it("distinguishes replay, conflict, in-progress, and retry", () => {
    const hash = hashIdempotencyRequest("feedback:submit", { id: 1 });

    expect(decideIdempotency(hash, null).action).toBe("execute");
    expect(
      decideIdempotency(hash, {
        requestHash: hash,
        state: "in_progress",
      }).action
    ).toBe("in_progress");
    expect(
      decideIdempotency(hash, {
        requestHash: "different",
        state: "completed",
      }).action
    ).toBe("conflict");
    expect(
      decideIdempotency(hash, {
        requestHash: hash,
        state: "completed",
        resourceId: "resource-1",
        responseStatus: 200,
        responseBody: "{\"ok\":true}",
      })
    ).toEqual({
      action: "replay",
      resourceId: "resource-1",
      responseStatus: 200,
      responseBody: "{\"ok\":true}",
    });
    expect(
      decideIdempotency(hash, {
        requestHash: hash,
        state: "failed",
      }).action
    ).toBe("execute");
  });
});

describe("outbox retry planning", () => {
  it("backs off deterministically and eventually dead-letters", () => {
    const now = new Date("2026-09-04T00:00:00.000Z");
    const retryPlan = planOutboxFailure(2, {
      maxAttempts: 4,
      baseDelayMs: 100,
      maxDelayMs: 1_000,
      now,
    });

    expect(retryPlan.action).toBe("retry");
    if (retryPlan.action === "retry") {
      expect(retryPlan.availableAt.toISOString()).toBe(
        "2026-09-04T00:00:00.200Z"
      );
    }

    expect(
      planOutboxFailure(4, {
        maxAttempts: 4,
        baseDelayMs: 100,
        maxDelayMs: 1_000,
        now,
      })
    ).toEqual({ action: "dead_letter", attempts: 4 });
  });
});
