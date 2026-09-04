import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  auditLedger,
  betaFeedback,
  eventOutbox,
  idempotencyRecords,
} from "../../drizzle/schema";
import {
  createDomainEvent,
  toOutboxRow,
} from "../../packages/event-fabric/src/index";
import { isMysqlDuplicateEntryFor } from "../_core/dbErrors";
import {
  InvalidIdempotencyKeyError,
  buildIdempotencyScope,
  decidePersistedIdempotency,
  decodeIdempotencyResponse,
  encodeIdempotencyResponse,
  eventIdempotencyFingerprint,
  mutationRequestHash,
  readIdempotencyKey,
} from "../_core/idempotency";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const feedbackInput = z.object({
  category: z.enum([
    "bug",
    "content",
    "privacy",
    "authorization",
    "data_integrity",
    "availability",
    "other",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  route: z.string().trim().min(1).max(255),
  summary: z.string().trim().min(5).max(255),
  details: z.string().trim().min(10).max(4000),
  expected: z.string().trim().min(3).max(2000),
  actual: z.string().trim().min(3).max(2000),
});

export const betaFeedbackRouter = router({
  submit: protectedProcedure
    .input(feedbackInput)
    .mutation(async ({ ctx, input }) => {
      let idempotencyKey: string | null;
      try {
        idempotencyKey = readIdempotencyKey(ctx.req);
      } catch (error) {
        if (error instanceof InvalidIdempotencyKeyError) {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        }
        throw error;
      }

      const scope = idempotencyKey
        ? buildIdempotencyScope("beta.feedback.submit", ctx.user.id)
        : null;
      const requestHash =
        scope && idempotencyKey
          ? mutationRequestHash(scope, {
              category: input.category,
              severity: input.severity,
              route: input.route,
              summary: input.summary,
              details: input.details,
              expected: input.expected,
              actual: input.actual,
            })
          : null;

      const id = randomUUID();
      const response = { id, status: "received" as const };
      const auditId = randomUUID();
      const event = createDomainEvent({
        eventType: "beta.feedback.submitted",
        schemaVersion: 1,
        producer: "skycoin4444.beta-feedback",
        aggregate: { type: "beta.feedback", id },
        correlationId: ctx.requestId,
        actorId: ctx.user.id,
        idempotencyKey:
          scope && idempotencyKey
            ? eventIdempotencyFingerprint(scope, idempotencyKey)
            : null,
        payload: {
          feedbackId: id,
          category: input.category,
          severity: input.severity,
          route: input.route,
        },
        metadata: { source: "trpc" },
      });

      try {
        await db.transaction(async tx => {
          let idempotencyRecordId: string | null = null;

          if (scope && idempotencyKey && requestHash) {
            idempotencyRecordId = randomUUID();
            await tx.insert(idempotencyRecords).values({
              id: idempotencyRecordId,
              scope,
              idempotencyKey,
              requestHash,
              state: "in_progress",
            });
          }

          await tx.insert(betaFeedback).values({
            id,
            userId: ctx.user.id,
            category: input.category,
            severity: input.severity,
            route: input.route,
            summary: input.summary,
            details: input.details,
            expected: input.expected,
            actual: input.actual,
            status: "received",
          });
          await tx.insert(auditLedger).values({
            id: auditId,
            userId: ctx.user.id,
            eventType: "engineering_beta_feedback",
            action: "submitted",
            details: JSON.stringify({
              id,
              category: input.category,
              severity: input.severity,
              route: input.route,
            }).slice(0, 255),
            status: "success",
          });
          await tx.insert(eventOutbox).values(toOutboxRow(event));

          if (idempotencyRecordId) {
            await tx
              .update(idempotencyRecords)
              .set({
                state: "completed",
                resourceId: id,
                responseStatus: 200,
                responseBody: encodeIdempotencyResponse(response),
                updatedAt: new Date(),
              })
              .where(eq(idempotencyRecords.id, idempotencyRecordId));
          }
        });
      } catch (error) {
        if (
          scope &&
          idempotencyKey &&
          requestHash &&
          isMysqlDuplicateEntryFor(
            error,
            "idempotency_records_scope_key_unique"
          )
        ) {
          const existing = await db.query.idempotencyRecords.findFirst({
            where: and(
              eq(idempotencyRecords.scope, scope),
              eq(idempotencyRecords.idempotencyKey, idempotencyKey)
            ),
          });

          if (!existing) {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "Idempotency key is reserved but its replay record is not visible",
            });
          }

          const decision = decidePersistedIdempotency(requestHash, existing);
          if (decision.action === "conflict") {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "Idempotency key was already used with different feedback",
            });
          }
          if (decision.action === "in_progress") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Idempotent feedback request is still in progress",
            });
          }
          if (decision.action === "replay") {
            return z
              .object({
                id: z.string(),
                status: z.literal("received"),
              })
              .parse(decodeIdempotencyResponse(decision.responseBody));
          }

          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Idempotency record cannot be safely reused; submit a new key",
          });
        }
        throw error;
      }

      return response;
    }),
});

