import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  auditLedger,
  eventOutbox,
} from "../../drizzle/schema";
import { db } from "../db";
import { adminProcedure, router } from "../_core/trpc";

type DeadLetterRow = Readonly<{
  id: string;
  eventType: string;
  schemaVersion: number;
  producer: string;
  aggregateType: string;
  aggregateId: string;
  attempts: number;
  availableAt: Date;
  createdAt: Date;
}>;

export type DeadLetterSummary = Readonly<{
  id: string;
  eventType: string;
  schemaVersion: number;
  producer: string;
  aggregateType: string;
  aggregateId: string;
  attempts: number;
  availableAt: string;
  createdAt: string;
}>;

export function toDeadLetterSummary(
  row: DeadLetterRow
): DeadLetterSummary {
  return Object.freeze({
    id: row.id,
    eventType: row.eventType,
    schemaVersion: row.schemaVersion,
    producer: row.producer,
    aggregateType: row.aggregateType,
    aggregateId: row.aggregateId,
    attempts: row.attempts,
    availableAt: row.availableAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  });
}

export function buildDeadLetterReplayAuditDetails(
  input: Readonly<{
    eventId: string;
    eventType: string;
    previousAttempts: number;
    reason: string;
  }>
): string {
  const reasonDigest = createHash("sha256")
    .update(input.reason)
    .digest("hex");

  return JSON.stringify({
    eventId: input.eventId,
    eventType: input.eventType,
    previousAttempts: input.previousAttempts,
    reasonDigest,
  }).slice(0, 255);
}

export function buildDeadLetterReplayPatch(now: Date) {
  return Object.freeze({
    state: "retry" as const,
    attempts: 0,
    availableAt: now,
    leasedUntil: null,
    leaseOwner: null,
    publishedAt: null,
    lastError: null,
  });
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

const listInput = z
  .object({
    limit: z.number().int().min(1).max(100).default(50),
  })
  .default({ limit: 50 });

const replayInput = z.object({
  id: z.string().trim().min(1).max(255),
  reason: z.string().trim().min(5).max(255),
});

export const eventOperationsRouter = router({
  deadLetters: adminProcedure
    .input(listInput)
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: eventOutbox.id,
          eventType: eventOutbox.eventType,
          schemaVersion: eventOutbox.schemaVersion,
          producer: eventOutbox.producer,
          aggregateType: eventOutbox.aggregateType,
          aggregateId: eventOutbox.aggregateId,
          attempts: eventOutbox.attempts,
          availableAt: eventOutbox.availableAt,
          createdAt: eventOutbox.createdAt,
        })
        .from(eventOutbox)
        .where(eq(eventOutbox.state, "dead_letter"))
        .orderBy(desc(eventOutbox.createdAt), desc(eventOutbox.id))
        .limit(input.limit);

      return Object.freeze({
        contract: "skycoin4444.dead-letter-operations.v1" as const,
        items: rows.map(toDeadLetterSummary),
        payloadExposed: false as const,
        rawErrorExposed: false as const,
        automaticReplay: false as const,
      });
    }),

  replayDeadLetter: adminProcedure
    .input(replayInput)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();

      return db.transaction(async tx => {
        const rows = await tx
          .select({
            id: eventOutbox.id,
            eventType: eventOutbox.eventType,
            attempts: eventOutbox.attempts,
          })
          .from(eventOutbox)
          .where(
            and(
              eq(eventOutbox.id, input.id),
              eq(eventOutbox.state, "dead_letter")
            )
          )
          .limit(1);

        const existing = rows[0];
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Dead-letter event was not found",
          });
        }

        const updateResult = await tx
          .update(eventOutbox)
          .set(buildDeadLetterReplayPatch(now))
          .where(
            and(
              eq(eventOutbox.id, input.id),
              eq(eventOutbox.state, "dead_letter")
            )
          );

        if (affectedRows(updateResult) !== 1) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Dead-letter state changed before replay could be scheduled",
          });
        }

        await tx.insert(auditLedger).values({
          id: randomUUID(),
          userId: ctx.user.id,
          eventType: "event_outbox_dead_letter",
          action: "replay_requested",
          details: buildDeadLetterReplayAuditDetails({
            eventId: existing.id,
            eventType: existing.eventType,
            previousAttempts: existing.attempts,
            reason: input.reason,
          }),
          status: "success",
        });

        return Object.freeze({
          id: existing.id,
          eventType: existing.eventType,
          state: "retry" as const,
          previousAttempts: existing.attempts,
          attemptsResetTo: 0 as const,
          availableAt: now.toISOString(),
          auditRecorded: true as const,
          payloadExposed: false as const,
          rawErrorExposed: false as const,
        });
      });
    }),
});
