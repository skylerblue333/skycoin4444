import { createHash, randomUUID } from "node:crypto";
import { computeBackoffDelay } from "../../platform-kernel/src/index";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  readonly [key: string]: JsonValue;
}
export interface JsonArray extends ReadonlyArray<JsonValue> {}

export type EventDataClassification =
  | "public"
  | "internal"
  | "sensitive"
  | "restricted";

export type EventDescriptor = Readonly<{
  eventType: string;
  currentVersion: number;
  owner: string;
  description: string;
  classification: EventDataClassification;
}>;

export type EventRegistry = Readonly<{
  descriptors: readonly EventDescriptor[];
  fingerprint: string;
}>;

export type DomainEventEnvelope<TPayload extends JsonValue = JsonValue> =
  Readonly<{
    eventId: string;
    eventType: string;
    schemaVersion: number;
    occurredAt: string;
    producer: string;
    aggregate: Readonly<{
      type: string;
      id: string;
    }>;
    correlationId: string;
    causationId: string | null;
    actorId: string | null;
    idempotencyKey: string | null;
    payload: TPayload;
    metadata: Readonly<Record<string, string>>;
  }>;

export type EventRuntime = Readonly<{
  idFactory?: () => string;
  clock?: () => Date;
}>;

export const MAX_EVENT_PAYLOAD_BYTES = 60_000;
const EVENT_TYPE_PATTERN = /^[a-z][a-z0-9_-]*(?:\.[a-z0-9_-]+)+$/;
const STABLE_NAME_PATTERN = /^[a-z][a-z0-9:_./-]{1,127}$/;

function assertStableName(value: string, label: string): void {
  if (!STABLE_NAME_PATTERN.test(value)) {
    throw new Error(label + " must be a stable lowercase identifier");
  }
}

function normalizeJson(value: JsonValue, path: string): JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Non-finite number at " + path);
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      normalizeJson(item, path + "[" + index + "]")
    );
  }

  if (typeof value === "object") {
    const normalized: Record<string, JsonValue> = {};
    for (const key of Object.keys(value).sort()) {
      const item = (value as Record<string, JsonValue>)[key];
      normalized[key] = normalizeJson(item, path + "." + key);
    }
    return normalized;
  }

  throw new TypeError("Unsupported JSON value at " + path);
}

export function canonicalJson(value: JsonValue): string {
  return JSON.stringify(normalizeJson(value, "$"));
}

export function payloadHash(value: JsonValue): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function compileEventRegistry(
  input: readonly EventDescriptor[]
): EventRegistry {
  const descriptors = [...input]
    .map(descriptor => {
      if (!EVENT_TYPE_PATTERN.test(descriptor.eventType)) {
        throw new Error("Invalid event type: " + descriptor.eventType);
      }
      if (
        !Number.isInteger(descriptor.currentVersion) ||
        descriptor.currentVersion < 1
      ) {
        throw new Error(
          "Event version must be a positive integer: " + descriptor.eventType
        );
      }
      if (!descriptor.owner.trim() || !descriptor.description.trim()) {
        throw new Error(
          "Event owner and description are required: " + descriptor.eventType
        );
      }
      return Object.freeze({ ...descriptor });
    })
    .sort((left, right) => left.eventType.localeCompare(right.eventType));

  const seen = new Set<string>();
  for (const descriptor of descriptors) {
    if (seen.has(descriptor.eventType)) {
      throw new Error("Duplicate event type: " + descriptor.eventType);
    }
    seen.add(descriptor.eventType);
  }

  const fingerprint = createHash("sha256")
    .update(JSON.stringify(descriptors))
    .digest("hex");

  return Object.freeze({
    descriptors: Object.freeze(descriptors),
    fingerprint,
  });
}

function assertMetadata(metadata: Readonly<Record<string, string>>): void {
  const entries = Object.entries(metadata);
  if (entries.length > 32) {
    throw new RangeError("Event metadata may contain at most 32 entries");
  }
  for (const [key, value] of entries) {
    if (!key.trim() || key.length > 128 || value.length > 512) {
      throw new RangeError("Event metadata key/value exceeds bounded limits");
    }
  }
}

export function createDomainEvent<TPayload extends JsonValue>(
  input: Readonly<{
    eventType: string;
    schemaVersion: number;
    producer: string;
    aggregate: Readonly<{ type: string; id: string }>;
    correlationId: string;
    causationId?: string | null;
    actorId?: string | null;
    idempotencyKey?: string | null;
    payload: TPayload;
    metadata?: Readonly<Record<string, string>>;
  }>,
  runtime: EventRuntime = {}
): DomainEventEnvelope<TPayload> {
  if (!EVENT_TYPE_PATTERN.test(input.eventType)) {
    throw new Error("Invalid event type: " + input.eventType);
  }
  if (!Number.isInteger(input.schemaVersion) || input.schemaVersion < 1) {
    throw new RangeError("schemaVersion must be a positive integer");
  }
  assertStableName(input.producer, "producer");
  assertStableName(input.aggregate.type, "aggregate.type");

  if (!input.aggregate.id.trim() || input.aggregate.id.length > 255) {
    throw new RangeError("aggregate.id must be between 1 and 255 characters");
  }
  if (!input.correlationId.trim() || input.correlationId.length > 255) {
    throw new RangeError("correlationId must be between 1 and 255 characters");
  }
  if ((input.causationId?.length ?? 0) > 255) {
    throw new RangeError("causationId cannot exceed 255 characters");
  }
  if ((input.actorId?.length ?? 0) > 255) {
    throw new RangeError("actorId cannot exceed 255 characters");
  }
  if ((input.idempotencyKey?.length ?? 0) > 255) {
    throw new RangeError("idempotencyKey cannot exceed 255 characters");
  }

  const normalizedPayload = normalizeJson(input.payload, "$") as TPayload;
  const serializedPayload = JSON.stringify(normalizedPayload);
  const bytes = Buffer.byteLength(serializedPayload, "utf8");
  if (bytes > MAX_EVENT_PAYLOAD_BYTES) {
    throw new RangeError(
      "Event payload exceeds " + MAX_EVENT_PAYLOAD_BYTES + " bytes"
    );
  }

  const metadata = Object.freeze({ ...(input.metadata ?? {}) });
  assertMetadata(metadata);

  const eventId = (runtime.idFactory ?? randomUUID)();
  if (!eventId.trim() || eventId.length > 255) {
    throw new RangeError("Generated event id is invalid");
  }

  const occurredAt = (runtime.clock ?? (() => new Date()))();
  if (Number.isNaN(occurredAt.getTime())) {
    throw new RangeError("Event clock returned an invalid date");
  }

  return Object.freeze({
    eventId,
    eventType: input.eventType,
    schemaVersion: input.schemaVersion,
    occurredAt: occurredAt.toISOString(),
    producer: input.producer,
    aggregate: Object.freeze({ ...input.aggregate }),
    correlationId: input.correlationId,
    causationId: input.causationId ?? null,
    actorId: input.actorId ?? null,
    idempotencyKey: input.idempotencyKey ?? null,
    payload: normalizedPayload,
    metadata,
  });
}

export function toOutboxRow(
  event: DomainEventEnvelope
): Readonly<{
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
  payload: string;
  metadata: string | null;
  state: "pending";
  attempts: 0;
  availableAt: Date;
}> {
  return Object.freeze({
    id: event.eventId,
    eventType: event.eventType,
    schemaVersion: event.schemaVersion,
    producer: event.producer,
    aggregateType: event.aggregate.type,
    aggregateId: event.aggregate.id,
    correlationId: event.correlationId,
    causationId: event.causationId,
    actorId: event.actorId,
    idempotencyKey: event.idempotencyKey,
    payload: canonicalJson(event.payload),
    metadata:
      Object.keys(event.metadata).length === 0
        ? null
        : canonicalJson(event.metadata),
    state: "pending" as const,
    attempts: 0 as const,
    availableAt: new Date(event.occurredAt),
  });
}

export type IdempotencyRecordView = Readonly<{
  requestHash: string;
  state: "in_progress" | "completed" | "failed";
  resourceId?: string | null;
  responseStatus?: number | null;
  responseBody?: string | null;
  expiresAt?: string | null;
}>;

export type IdempotencyDecision =
  | Readonly<{ action: "execute" }>
  | Readonly<{ action: "in_progress" }>
  | Readonly<{
      action: "replay";
      resourceId: string | null;
      responseStatus: number | null;
      responseBody: string | null;
    }>
  | Readonly<{ action: "conflict" }>;

export function hashIdempotencyRequest(
  scope: string,
  payload: JsonValue
): string {
  if (!scope.trim() || scope.length > 128) {
    throw new RangeError("Idempotency scope must be between 1 and 128 characters");
  }
  return createHash("sha256")
    .update(scope)
    .update("\0")
    .update(canonicalJson(payload))
    .digest("hex");
}

export function decideIdempotency(
  expectedRequestHash: string,
  existing: IdempotencyRecordView | null,
  now: Date = new Date()
): IdempotencyDecision {
  if (!existing) return Object.freeze({ action: "execute" as const });

  if (
    existing.expiresAt &&
    new Date(existing.expiresAt).getTime() <= now.getTime()
  ) {
    return Object.freeze({ action: "execute" as const });
  }

  if (existing.requestHash !== expectedRequestHash) {
    return Object.freeze({ action: "conflict" as const });
  }

  if (existing.state === "completed") {
    return Object.freeze({
      action: "replay" as const,
      resourceId: existing.resourceId ?? null,
      responseStatus: existing.responseStatus ?? null,
      responseBody: existing.responseBody ?? null,
    });
  }

  if (existing.state === "in_progress") {
    return Object.freeze({ action: "in_progress" as const });
  }

  return Object.freeze({ action: "execute" as const });
}

export type OutboxFailurePlan = Readonly<
  | {
      action: "retry";
      attempts: number;
      availableAt: Date;
    }
  | {
      action: "dead_letter";
      attempts: number;
    }
>;

export function planOutboxFailure(
  completedAttempts: number,
  options: Readonly<{
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    now?: Date;
  }>
): OutboxFailurePlan {
  if (!Number.isInteger(completedAttempts) || completedAttempts < 1) {
    throw new RangeError("completedAttempts must be a positive integer");
  }
  if (!Number.isInteger(options.maxAttempts) || options.maxAttempts < 1) {
    throw new RangeError("maxAttempts must be a positive integer");
  }

  if (completedAttempts >= options.maxAttempts) {
    return Object.freeze({
      action: "dead_letter" as const,
      attempts: completedAttempts,
    });
  }

  const delay = computeBackoffDelay(completedAttempts, {
    baseDelayMs: options.baseDelayMs,
    maxDelayMs: options.maxDelayMs,
    jitterRatio: 0,
  });

  return Object.freeze({
    action: "retry" as const,
    attempts: completedAttempts,
    availableAt: new Date((options.now ?? new Date()).getTime() + delay),
  });
}
