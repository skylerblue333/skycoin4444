import { describe, expect, it } from "vitest";
import {
  OutboxDispatcherService,
  buildOutboxFailurePatch,
  outboxDispatcherOptionsFromEnv,
  type OutboxDispatcherRuntimeOptions,
} from "./outboxDispatcher";
import type {
  MarkFailureInput,
  MarkPublishedInput,
  OutboxDispatchMessage,
  OutboxLeaseRepository,
} from "../../packages/event-fabric/src/dispatcher";

const baseRuntimeOptions: OutboxDispatcherRuntimeOptions = {
  enabled: true,
  pollMs: 1_000,
  dispatch: {
    batchSize: 10,
    leaseMs: 5_000,
    maxAttempts: 3,
    baseDelayMs: 100,
    maxDelayMs: 1_000,
  },
};

class FakeRepository implements OutboxLeaseRepository {
  published: MarkPublishedInput[] = [];
  failures: MarkFailureInput[] = [];

  async leaseBatch(): Promise<readonly OutboxDispatchMessage[]> {
    return [];
  }

  async markPublished(input: MarkPublishedInput): Promise<boolean> {
    this.published.push(input);
    return true;
  }

  async markFailure(input: MarkFailureInput): Promise<boolean> {
    this.failures.push(input);
    return true;
  }
}

describe("outbox dispatcher runtime options", () => {
  it("is disabled by default with bounded settings", () => {
    expect(
      outboxDispatcherOptionsFromEnv({} as NodeJS.ProcessEnv)
    ).toEqual({
      enabled: false,
      pollMs: 1_000,
      dispatch: {
        batchSize: 25,
        leaseMs: 15_000,
        maxAttempts: 8,
        baseDelayMs: 500,
        maxDelayMs: 60_000,
      },
    });
  });

  it("parses explicit safe settings and rejects invalid booleans", () => {
    expect(
      outboxDispatcherOptionsFromEnv({
        EVENT_OUTBOX_DISPATCHER_ENABLED: "true",
        EVENT_OUTBOX_POLL_MS: "2000",
        EVENT_OUTBOX_BATCH_SIZE: "40",
        EVENT_OUTBOX_LEASE_MS: "20000",
        EVENT_OUTBOX_MAX_ATTEMPTS: "6",
        EVENT_OUTBOX_BASE_DELAY_MS: "1000",
        EVENT_OUTBOX_MAX_DELAY_MS: "120000",
      } as NodeJS.ProcessEnv)
    ).toMatchObject({
      enabled: true,
      pollMs: 2_000,
      dispatch: {
        batchSize: 40,
        leaseMs: 20_000,
        maxAttempts: 6,
        baseDelayMs: 1_000,
        maxDelayMs: 120_000,
      },
    });

    expect(() =>
      outboxDispatcherOptionsFromEnv({
        EVENT_OUTBOX_DISPATCHER_ENABLED: "yes",
      } as NodeJS.ProcessEnv)
    ).toThrow(/exactly/);
  });
});

describe("outbox durable failure patch", () => {
  it("sanitizes durable failure text before persistence", () => {
    const patch = buildOutboxFailurePatch({
      id: "event-1",
      owner: "worker-1",
      now: new Date("2026-09-04T18:00:00.000Z"),
      error:
        "connect mysql://admin:secret@db.example/sky?access_token=abc123",
      plan: {
        action: "dead_letter",
        attempts: 8,
      },
    });

    expect(patch.state).toBe("dead_letter");
    expect(patch.attempts).toBe(8);
    expect(patch.lastError).not.toContain("secret");
    expect(patch.lastError).not.toContain("abc123");
    expect(patch.lastError).toContain("[redacted]");
  });
});

describe("outbox dispatcher service", () => {
  it("reports truthful internal-only transport boundaries", () => {
    const service = new OutboxDispatcherService(
      new FakeRepository(),
      {
        name: "test-consumer",
        async consume() {},
      },
      { ...baseRuntimeOptions, enabled: false }
    );

    expect(service.snapshot()).toMatchObject({
      enabled: false,
      running: false,
      consumer: "test-consumer",
      externalTransportConfigured: false,
      productionExternalDeliveryClaim: false,
      cycles: 0,
      lastCycle: null,
    });
  });

  it("runs one empty cycle deterministically", async () => {
    const service = new OutboxDispatcherService(
      new FakeRepository(),
      {
        name: "test-consumer",
        async consume() {},
      },
      { ...baseRuntimeOptions, enabled: false }
    );

    const result = await service.runOnce();
    expect(result.leased).toBe(0);
    expect(service.snapshot().cycles).toBe(1);
    expect(service.snapshot().lastCycle).toEqual({
      leased: 0,
      published: 0,
      retried: 0,
      deadLettered: 0,
      consumerFailed: 0,
      leaseLost: 0,
    });
  });
});
