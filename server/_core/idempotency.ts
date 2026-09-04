import { createHash } from "node:crypto";
import type { Request } from "express";
import {
  decideIdempotency,
  hashIdempotencyRequest,
  type IdempotencyDecision,
  type JsonValue,
} from "../../packages/event-fabric/src/index";

export const IDEMPOTENCY_HEADER = "idempotency-key";
export const LEGACY_IDEMPOTENCY_HEADER = "x-idempotency-key";
const KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const OPERATION_PATTERN = /^[a-z][a-z0-9.-]{2,63}$/;

export class InvalidIdempotencyKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidIdempotencyKeyError";
  }
}

export type PersistedIdempotencyRecord = Readonly<{
  requestHash: string;
  state: string;
  resourceId: string | null;
  responseStatus: number | null;
  responseBody: string | null;
  expiresAt: Date | null;
}>;

export type PersistedIdempotencyDecision =
  | IdempotencyDecision
  | Readonly<{ action: "invalid_record" }>;

export function readIdempotencyKey(req: Pick<Request, "get">): string | null {
  const standard = req.get(IDEMPOTENCY_HEADER);
  const legacy = req.get(LEGACY_IDEMPOTENCY_HEADER);

  if (standard && legacy && standard !== legacy) {
    throw new InvalidIdempotencyKeyError(
      "Idempotency-Key and X-Idempotency-Key must match when both are supplied"
    );
  }

  const raw = standard ?? legacy;
  if (raw === undefined) return null;

  if (raw !== raw.trim()) {
    throw new InvalidIdempotencyKeyError(
      "Idempotency key must not contain surrounding whitespace"
    );
  }

  if (!KEY_PATTERN.test(raw)) {
    throw new InvalidIdempotencyKeyError(
      "Idempotency key must be 1-128 URL-safe characters"
    );
  }

  return raw;
}

export function buildIdempotencyScope(
  operation: string,
  actorId: string
): string {
  if (!OPERATION_PATTERN.test(operation)) {
    throw new RangeError("Invalid idempotency operation name");
  }
  if (!actorId.trim()) {
    throw new RangeError("Idempotency actor id is required");
  }

  const actorDigest = createHash("sha256")
    .update(actorId)
    .digest("hex")
    .slice(0, 24);
  return operation + ":actor:" + actorDigest;
}

export function mutationRequestHash(
  scope: string,
  payload: JsonValue
): string {
  return hashIdempotencyRequest(scope, payload);
}

export function eventIdempotencyFingerprint(
  scope: string,
  key: string
): string {
  return createHash("sha256")
    .update(scope)
    .update("\0")
    .update(key)
    .digest("hex");
}

export function decidePersistedIdempotency(
  expectedRequestHash: string,
  existing: PersistedIdempotencyRecord
): PersistedIdempotencyDecision {
  if (
    existing.state !== "in_progress" &&
    existing.state !== "completed" &&
    existing.state !== "failed"
  ) {
    return Object.freeze({ action: "invalid_record" as const });
  }

  return decideIdempotency(expectedRequestHash, {
    requestHash: existing.requestHash,
    state: existing.state,
    resourceId: existing.resourceId,
    responseStatus: existing.responseStatus,
    responseBody: existing.responseBody,
    expiresAt: existing.expiresAt?.toISOString() ?? null,
  });
}

export function encodeIdempotencyResponse(value: unknown): string {
  const encoded = JSON.stringify(value);
  if (Buffer.byteLength(encoded, "utf8") > 60_000) {
    throw new RangeError("Idempotency response exceeds durable storage boundary");
  }
  return encoded;
}

export function decodeIdempotencyResponse(body: string | null): unknown {
  if (body === null) {
    throw new Error("Completed idempotency record is missing responseBody");
  }
  return JSON.parse(body) as unknown;
}
