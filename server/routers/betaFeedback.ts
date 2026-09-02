import { randomUUID } from "node:crypto";
import { z } from "zod";
import { auditLedger, betaFeedback } from "../../drizzle/schema";
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
      const id = randomUUID();
      await db.insert(betaFeedback).values({
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
      await db.insert(auditLedger).values({
        id: randomUUID(),
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
      return { id, status: "received" as const };
    }),
});
