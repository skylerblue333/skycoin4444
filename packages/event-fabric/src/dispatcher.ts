import { createHash, randomUUID } from "node:crypto";
import {
  planOutboxFailure,
  type OutboxFailurePlan,
} from "./index";

export type OutboxDispatchMessage = Readonly<{
  id: string;
  eventType: string;
  schemaVersion: number;
  producer: string;
  aggregateType: string;
  aggregateId: string;
  correlationId: string;
  causationId: string | null;
  actorId: string | null;
  idempotencyKey: string | null;
  payloadJson: string;
  metadataJson: string | null;
  attempts: number;
  createdAt: Date;
}>;

export type LeaseBatchInput = Readonly<{
  owner: string;
  limit: number;
  now: Date;
  leaseUntil: Date;
}>;

export type MarkPublishedInput = Readonly<{
  id: string;
  owner: string;
  publishedAt: Date;
}>;

export type MarkFailureInput = Readonly<{
  id: string;
  owner: string;
  plan: OutboxFailurePlan;
  error: string;
  now: Date;
}>;

export interface OutboxLeaseRepository {
  leaseBatch(input: LeaseBatchInput): Promise<readonly OutboxDispatchMessage[]>;
  markPublished(input: MarkPublishedInput): Promise<boolean>;
  markFailure(input: MarkFailureInput): Promise<boolean>;
}

export interface OutboxConsumer {
  readonly name: string;
  consume(message: OutboxDispatchMessage): Promise<void>;
}

export type OutboxDispatcherOptions = Readonly<{
  batchSize: number;
  leaseMs: number;
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}>;

export type OutboxDispatchSummary = Readonly<{
  leaseOwner: string;
  leased: number;
  published: number;
  retried: number;
  deadLettered: number;
  consumerFailed: number;
  leaseLost: number;
}>;

function positiveInteger(
  value: number,
  label: string,
  max: number
): number {
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw new RangeError(
      label + " must be an integer between 1 and " + max
    );
  }
  return value;
}

export function validateOutboxDispatcherOptions(
  options: OutboxDispatcherOptions
): OutboxDispatcherOptions {
  const batchSize = positiveInteger(options.batchSize, "batchSize", 500);
  const leaseMs = positiveInteger(options.leaseMs, "leaseMs", 300_000);
  const maxAttempts = positiveInteger(
    options.maxAttempts,
    "maxAttempts",
    100
  );
  const baseDelayMs = positiveInteger(
    options.baseDelayMs,
    "baseDelayMs",
    300_000
  );
  const maxDelayMs = positiveInteger(
    options.maxDelayMs,
    "maxDelayMs",
    3_600_000
  );

  if (baseDelayMs > maxDelayMs) {
    throw new RangeError("baseDelayMs cannot exceed maxDelayMs");
  }

  return Object.freeze({
    batchSize,
    leaseMs,
    maxAttempts,
    baseDelayMs,
    maxDelayMs,
  });
}

export function createLeaseOwner(
  prefix: string,
  idFactory: () => string = randomUUID
): string {
  if (!/^[a-z][a-z0-9_-]{1,23}$/.test(prefix)) {
    throw new Error(
      "lease owner prefix must be 2-24 lowercase identifier characters"
    );
  }

  const token = createHash("sha256")
    .update(idFactory())
    .digest("hex")
    .slice(0, 32);

  return prefix + ":" + token;
}

export function boundedDispatchError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.name + ": " + error.message
      : String(error);
  return raw.replace(/\s+/g, " ").trim().slice(0, 2_000);
}

export async function dispatchOutboxBatch(
  input: Readonly<{
    repository: OutboxLeaseRepository;
    consumer: OutboxConsumer;
    options: OutboxDispatcherOptions;
    now?: () => Date;
    leaseOwner?: string;
  }>
): Promise<OutboxDispatchSummary> {
  const options = validateOutboxDispatcherOptions(input.options);
  const clock = input.now ?? (() => new Date());
  const startedAt = clock();
  const leaseOwner =
    input.leaseOwner ?? createLeaseOwner("outbox-dispatcher");
  const leaseUntil = new Date(startedAt.getTime() + options.leaseMs);

  const messages = await input.repository.leaseBatch({
    owner: leaseOwner,
    limit: options.batchSize,
    now: startedAt,
    leaseUntil,
  });

  let published = 0;
  let retried = 0;
  let deadLettered = 0;
  let consumerFailed = 0;
  let leaseLost = 0;

  for (const message of messages) {
    try {
      await input.consumer.consume(message);
      const marked = await input.repository.markPublished({
        id: message.id,
        owner: leaseOwner,
        publishedAt: clock(),
      });
      if (marked) published += 1;
      else leaseLost += 1;
    } catch (error) {
      consumerFailed += 1;
      const completedAttempts = message.attempts + 1;
      const now = clock();
      const plan = planOutboxFailure(completedAttempts, {
        maxAttempts: options.maxAttempts,
        baseDelayMs: options.baseDelayMs,
        maxDelayMs: options.maxDelayMs,
        now,
      });
      const marked = await input.repository.markFailure({
        id: message.id,
        owner: leaseOwner,
        plan,
        error: boundedDispatchError(error),
        now,
      });

      if (!marked) {
        leaseLost += 1;
        continue;
      }

      if (plan.action === "retry") retried += 1;
      else deadLettered += 1;
    }
  }

  return Object.freeze({
    leaseOwner,
    leased: messages.length,
    published,
    retried,
    deadLettered,
    consumerFailed,
    leaseLost,
  });
}
