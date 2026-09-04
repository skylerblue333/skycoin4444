import { describe, expect, it } from "vitest";
import {
  boundedDispatchError,
  createLeaseOwner,
  dispatchOutboxBatch,
  validateOutboxDispatcherOptions,
  type MarkFailureInput,
  type MarkPublishedInput,
  type OutboxDispatchMessage,
  type OutboxLeaseRepository,
} from "./dispatcher";

function message(
  id: string,
  attempts = 0
): OutboxDispatchMessage {
  return {
    id,
    eventType: "social.post.created",
    schemaVersion: 1,
    producer: "skycoin4444.social",
    aggregateType: "social.post",
    aggregateId: id,
    correlationId: "request-" + id,
    causationId: null,
    actorId: "user-1",
    idempotencyKey: null,
    payloadJson: "{\"postId\":\"" + id + "\"}",
    metadataJson: null,
    attempts,
    createdAt: new Date("2026-09-04T00:00:00.000Z"),
  };
}

class FakeRepository implements OutboxLeaseRepository {
  published: MarkPublishedInput[] = [];
  failures: MarkFailureInput[] = [];
  publishResult = true;
  failureResult = true;

  constructor(readonly messages: readonly OutboxDispatchMessage[]) {}

  async leaseBatch() {
    return this.messages;
  }

  async markPublished(input: MarkPublishedInput) {
    this.published.push(input);
    return this.publishResult;
  }

  async markFailure(input: MarkFailureInput) {
    this.failures.push(input);
    return this.failureResult;
  }
}

const options = {
  batchSize: 25,
  leaseMs: 15_000,
  maxAttempts: 3,
  baseDelayMs: 100,
  maxDelayMs: 10_000,
};

describe("outbox dispatcher", () => {
  it("publishes leased events through an idempotent consumer", async () => {
    const repository = new FakeRepository([message("event-1")]);
    const consumed: string[] = [];

    const result = await dispatchOutboxBatch({
      repository,
      consumer: {
        name: "test-consumer",
        async consume(event) {
          consumed.push(event.id);
        },
      },
      options,
      leaseOwner: "worker:lease-1",
      now: () => new Date("2026-09-04T00:00:00.000Z"),
    });

    expect(consumed).toEqual(["event-1"]);
    expect(repository.published).toHaveLength(1);
    expect(result).toEqual({
      leaseOwner: "worker:lease-1",
      leased: 1,
      published: 1,
      retried: 0,
      deadLettered: 0,
      consumerFailed: 0,
      leaseLost: 0,
    });
  });

  it("schedules deterministic retry after a consumer failure", async () => {
    const repository = new FakeRepository([message("event-2", 0)]);

    const result = await dispatchOutboxBatch({
      repository,
      consumer: {
        name: "test-consumer",
        async consume() {
          throw new Error("temporary downstream error");
        },
      },
      options,
      leaseOwner: "worker:lease-2",
      now: () => new Date("2026-09-04T00:00:00.000Z"),
    });

    expect(result.retried).toBe(1);
    expect(result.consumerFailed).toBe(1);
    expect(repository.failures[0]?.plan.action).toBe("retry");
    if (repository.failures[0]?.plan.action === "retry") {
      expect(
        repository.failures[0].plan.availableAt.toISOString()
      ).toBe("2026-09-04T00:00:00.100Z");
    }
  });

  it("dead-letters after the configured maximum attempts", async () => {
    const repository = new FakeRepository([message("event-3", 2)]);

    const result = await dispatchOutboxBatch({
      repository,
      consumer: {
        name: "test-consumer",
        async consume() {
          throw new Error("permanent failure");
        },
      },
      options,
      leaseOwner: "worker:lease-3",
      now: () => new Date("2026-09-04T00:00:00.000Z"),
    });

    expect(result.deadLettered).toBe(1);
    expect(repository.failures[0]?.plan).toEqual({
      action: "dead_letter",
      attempts: 3,
    });
  });

  it("does not report publication if the lease was lost", async () => {
    const repository = new FakeRepository([message("event-4")]);
    repository.publishResult = false;

    const result = await dispatchOutboxBatch({
      repository,
      consumer: {
        name: "test-consumer",
        async consume() {},
      },
      options,
      leaseOwner: "worker:lease-4",
    });

    expect(result.published).toBe(0);
    expect(result.leaseLost).toBe(1);
  });

  it("bounds errors and validates unsafe dispatcher options", () => {
    expect(
      boundedDispatchError(new Error("x".repeat(3_000))).length
    ).toBeLessThanOrEqual(2_000);

    expect(() =>
      validateOutboxDispatcherOptions({
        ...options,
        batchSize: 0,
      })
    ).toThrow(/batchSize/);

    expect(() =>
      validateOutboxDispatcherOptions({
        ...options,
        baseDelayMs: 20_000,
        maxDelayMs: 10_000,
      })
    ).toThrow(/baseDelayMs/);
  });

  it("creates bounded opaque lease owner tokens", () => {
    const owner = createLeaseOwner(
      "event-worker",
      () => "predictable-id"
    );

    expect(owner).toMatch(/^event-worker:[a-f0-9]{32}$/);
    expect(owner).not.toContain("predictable-id");
    expect(owner.length).toBeLessThanOrEqual(64);
  });
});
