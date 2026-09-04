import type { Express } from "express";
import {
  and,
  asc,
  eq,
  isNull,
  lte,
  or,
} from "drizzle-orm";
import { createHash, randomUUID } from "node:crypto";
import {
  eventConsumerReceipts,
  eventOutbox,
  platformMetrics,
} from "../../drizzle/schema";
import {
  dispatchOutboxBatch,
  validateOutboxDispatcherOptions,
  type MarkFailureInput,
  type MarkPublishedInput,
  type OutboxConsumer,
  type OutboxDispatchMessage,
  type OutboxDispatchSummary,
  type OutboxDispatcherOptions,
  type OutboxLeaseRepository,
} from "../../packages/event-fabric/src/dispatcher";
import { db } from "../db";
import { isMysqlDuplicateEntryFor } from "./dbErrors";
import { sanitizeOperationalError } from "./operationalError";

export const INTERNAL_EVENT_CONSUMER = "platform-event-observer";

export type OutboxDispatcherRuntimeOptions = Readonly<{
  enabled: boolean;
  pollMs: number;
  dispatch: OutboxDispatcherOptions;
}>;

type PublicCycleSummary = Readonly<
  Omit<OutboxDispatchSummary, "leaseOwner">
>;

export type OutboxDispatcherSnapshot = Readonly<{
  enabled: boolean;
  running: boolean;
  consumer: string;
  externalTransportConfigured: false;
  productionExternalDeliveryClaim: false;
  cycles: number;
  lastCycleAt: string | null;
  lastCycle: PublicCycleSummary | null;
  lastFailureAt: string | null;
  options: Readonly<{
    pollMs: number;
    batchSize: number;
    leaseMs: number;
    maxAttempts: number;
  }>;
}>;

function boundedInteger(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
  label: string
): number {
  if (!raw?.trim()) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(
      label + " must be an integer between " + min + " and " + max
    );
  }
  return value;
}

function booleanFromEnv(
  raw: string | undefined,
  fallback: boolean,
  label: string
): boolean {
  if (!raw?.trim()) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new RangeError(label + ' must be exactly "true" or "false"');
}

export function outboxDispatcherOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): OutboxDispatcherRuntimeOptions {
  const dispatch = validateOutboxDispatcherOptions({
    batchSize: boundedInteger(
      env.EVENT_OUTBOX_BATCH_SIZE,
      25,
      1,
      500,
      "EVENT_OUTBOX_BATCH_SIZE"
    ),
    leaseMs: boundedInteger(
      env.EVENT_OUTBOX_LEASE_MS,
      15_000,
      1_000,
      300_000,
      "EVENT_OUTBOX_LEASE_MS"
    ),
    maxAttempts: boundedInteger(
      env.EVENT_OUTBOX_MAX_ATTEMPTS,
      8,
      1,
      100,
      "EVENT_OUTBOX_MAX_ATTEMPTS"
    ),
    baseDelayMs: boundedInteger(
      env.EVENT_OUTBOX_BASE_DELAY_MS,
      500,
      1,
      300_000,
      "EVENT_OUTBOX_BASE_DELAY_MS"
    ),
    maxDelayMs: boundedInteger(
      env.EVENT_OUTBOX_MAX_DELAY_MS,
      60_000,
      1,
      3_600_000,
      "EVENT_OUTBOX_MAX_DELAY_MS"
    ),
  });

  return Object.freeze({
    enabled: booleanFromEnv(
      env.EVENT_OUTBOX_DISPATCHER_ENABLED,
      false,
      "EVENT_OUTBOX_DISPATCHER_ENABLED"
    ),
    pollMs: boundedInteger(
      env.EVENT_OUTBOX_POLL_MS,
      1_000,
      250,
      60_000,
      "EVENT_OUTBOX_POLL_MS"
    ),
    dispatch,
  });
}

function dispatchEligible(now: Date) {
  return and(
    lte(eventOutbox.availableAt, now),
    or(
      eq(eventOutbox.state, "pending"),
      eq(eventOutbox.state, "retry"),
      and(
        eq(eventOutbox.state, "leased"),
        or(
          isNull(eventOutbox.leasedUntil),
          lte(eventOutbox.leasedUntil, now)
        )
      )
    )
  );
}

function affectedRows(result: unknown): number {
  if (Array.isArray(result)) {
    for (const value of result) {
      if (
        value &&
        typeof value === "object" &&
        "affectedRows" in value
      ) {
        const count = Number(
          (value as { affectedRows?: unknown }).affectedRows
        );
        if (Number.isFinite(count)) return count;
      }
    }
  }

  if (
    result &&
    typeof result === "object" &&
    "affectedRows" in result
  ) {
    const count = Number(
      (result as { affectedRows?: unknown }).affectedRows
    );
    if (Number.isFinite(count)) return count;
  }

  return 0;
}

function toDispatchMessage(
  row: typeof eventOutbox.$inferSelect
): OutboxDispatchMessage {
  return Object.freeze({
    id: row.id,
    eventType: row.eventType,
    schemaVersion: row.schemaVersion,
    producer: row.producer,
    aggregateType: row.aggregateType,
    aggregateId: row.aggregateId,
    correlationId: row.correlationId,
    causationId: row.causationId,
    actorId: row.actorId,
    idempotencyKey: row.idempotencyKey,
    payloadJson: row.payload,
    metadataJson: row.metadata,
    attempts: row.attempts,
    createdAt: row.createdAt,
  });
}

export class DrizzleOutboxRepository
  implements OutboxLeaseRepository
{
  async leaseBatch(input: {
    owner: string;
    limit: number;
    now: Date;
    leaseUntil: Date;
  }): Promise<readonly OutboxDispatchMessage[]> {
    const candidates = await db
      .select()
      .from(eventOutbox)
      .where(dispatchEligible(input.now))
      .orderBy(
        asc(eventOutbox.availableAt),
        asc(eventOutbox.createdAt),
        asc(eventOutbox.id)
      )
      .limit(input.limit);

    const leased: OutboxDispatchMessage[] = [];

    for (const candidate of candidates) {
      const result = await db
        .update(eventOutbox)
        .set({
          state: "leased",
          leaseOwner: input.owner,
          leasedUntil: input.leaseUntil,
        })
        .where(
          and(
            eq(eventOutbox.id, candidate.id),
            dispatchEligible(input.now)
          )
        );

      if (affectedRows(result) === 1) {
        leased.push(toDispatchMessage(candidate));
      }
    }

    return leased;
  }

  async markPublished(
    input: MarkPublishedInput
  ): Promise<boolean> {
    const result = await db
      .update(eventOutbox)
      .set({
        state: "published",
        publishedAt: input.publishedAt,
        leasedUntil: null,
        leaseOwner: null,
        lastError: null,
      })
      .where(
        and(
          eq(eventOutbox.id, input.id),
          eq(eventOutbox.state, "leased"),
          eq(eventOutbox.leaseOwner, input.owner)
        )
      );

    return affectedRows(result) === 1;
  }

  async markFailure(input: MarkFailureInput): Promise<boolean> {
    const retry = input.plan.action === "retry";
    const result = await db
      .update(eventOutbox)
      .set({
        state: retry ? "retry" : "dead_letter",
        attempts: input.plan.attempts,
        availableAt: retry ? input.plan.availableAt : input.now,
        leasedUntil: null,
        leaseOwner: null,
        lastError: sanitizeOperationalError(input.error),
      })
      .where(
        and(
          eq(eventOutbox.id, input.id),
          eq(eventOutbox.state, "leased"),
          eq(eventOutbox.leaseOwner, input.owner)
        )
      );

    return affectedRows(result) === 1;
  }
}

export class PlatformEventObserver implements OutboxConsumer {
  readonly name = INTERNAL_EVENT_CONSUMER;

  async consume(message: OutboxDispatchMessage): Promise<void> {
    const metricId =
      "event:" +
      createHash("sha256")
        .update(this.name)
        .update("\0")
        .update(message.id)
        .digest("hex");

    try {
      await db.transaction(async tx => {
        await tx.insert(eventConsumerReceipts).values({
          id: randomUUID(),
          eventId: message.id,
          consumer: this.name,
          eventType: message.eventType,
        });

        await tx.insert(platformMetrics).values({
          id: metricId,
          metricType: "event_processed:" + message.eventType,
          value: 1,
          timestamp: new Date(),
        });
      });
    } catch (error) {
      if (
        isMysqlDuplicateEntryFor(
          error,
          "event_consumer_receipts_event_consumer_unique"
        )
      ) {
        return;
      }
      throw error;
    }
  }
}

function publicCycle(
  summary: OutboxDispatchSummary
): PublicCycleSummary {
  return Object.freeze({
    leased: summary.leased,
    published: summary.published,
    retried: summary.retried,
    deadLettered: summary.deadLettered,
    consumerFailed: summary.consumerFailed,
    leaseLost: summary.leaseLost,
  });
}

export class OutboxDispatcherService {
  private timer: NodeJS.Timeout | null = null;
  private inFlight: Promise<OutboxDispatchSummary> | null = null;
  private running = false;
  private cycles = 0;
  private lastCycleAt: Date | null = null;
  private lastCycle: PublicCycleSummary | null = null;
  private lastFailureAt: Date | null = null;

  constructor(
    private readonly repository: OutboxLeaseRepository,
    private readonly consumer: OutboxConsumer,
    readonly options: OutboxDispatcherRuntimeOptions
  ) {}

  start(): void {
    if (!this.options.enabled || this.running) return;
    this.running = true;
    void this.tick();
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.inFlight) {
      await this.inFlight.catch(() => undefined);
    }
  }

  async runOnce(): Promise<OutboxDispatchSummary> {
    if (this.inFlight) return this.inFlight;

    const cycle = dispatchOutboxBatch({
      repository: this.repository,
      consumer: this.consumer,
      options: this.options.dispatch,
    });
    this.inFlight = cycle;

    try {
      const summary = await cycle;
      this.cycles += 1;
      this.lastCycleAt = new Date();
      this.lastCycle = publicCycle(summary);
      return summary;
    } finally {
      this.inFlight = null;
    }
  }

  snapshot(): OutboxDispatcherSnapshot {
    return Object.freeze({
      enabled: this.options.enabled,
      running: this.running,
      consumer: this.consumer.name,
      externalTransportConfigured: false,
      productionExternalDeliveryClaim: false,
      cycles: this.cycles,
      lastCycleAt: this.lastCycleAt?.toISOString() ?? null,
      lastCycle: this.lastCycle,
      lastFailureAt: this.lastFailureAt?.toISOString() ?? null,
      options: Object.freeze({
        pollMs: this.options.pollMs,
        batchSize: this.options.dispatch.batchSize,
        leaseMs: this.options.dispatch.leaseMs,
        maxAttempts: this.options.dispatch.maxAttempts,
      }),
    });
  }

  private async tick(): Promise<void> {
    if (!this.running) return;

    try {
      await this.runOnce();
    } catch (error) {
      this.lastFailureAt = new Date();
      console.error(
        "[EventOutbox] dispatch cycle failed",
        sanitizeOperationalError(error)
      );
    } finally {
      if (!this.running) return;
      this.timer = setTimeout(
        () => void this.tick(),
        this.options.pollMs
      );
      this.timer.unref();
    }
  }
}

export function createOutboxDispatcherService(
  env: NodeJS.ProcessEnv = process.env
): OutboxDispatcherService {
  return new OutboxDispatcherService(
    new DrizzleOutboxRepository(),
    new PlatformEventObserver(),
    outboxDispatcherOptionsFromEnv(env)
  );
}

export function registerOutboxDispatcherRoutes(
  app: Express,
  dispatcher: OutboxDispatcherService
): void {
  app.get("/api/platform/events/dispatcher", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      contract: "skycoin4444.event-outbox-dispatcher.v1",
      ...dispatcher.snapshot(),
    });
  });
}
