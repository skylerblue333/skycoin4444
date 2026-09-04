import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  betaFeedback,
  comments,
  courseProgress,
  creatorEvidenceDrafts,
  discoveryBookmarks,
  follows,
  likes,
  notificationPreferences,
  notifications,
  posts,
  privacyRequests,
  searchHistory,
  users,
} from "../../drizzle/schema";
import {
  createPrivacyRequest,
  transitionPrivacyRequest,
  type PrivacyStatus,
} from "../../packages/sky-privacy/src/index";
import { db } from "../db";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";

const exportCategory = z.enum([
  "profile",
  "social",
  "learning",
  "feedback",
  "discovery",
  "creator",
  "notifications",
  "privacy_requests",
]);

const allExportCategories = exportCategory.options;

function normalizePrivacyStatus(value: string): PrivacyStatus {
  if (
    value === "requested" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Privacy request has an unsupported status",
  });
}

export const privacyRouter = router({
  exportData: protectedProcedure
    .input(
      z
        .object({
          categories: z.array(exportCategory).min(1).max(allExportCategories.length),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const categories = input?.categories ?? allExportCategories;
      const requested = new Set(categories);
      const output: Record<string, unknown> = {};

      if (requested.has("profile")) {
        output.profile = await db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: {
            id: true,
            openId: true,
            email: true,
            username: true,
            name: true,
            bio: true,
            avatar: true,
            profileVisibility: true,
            role: true,
            verified: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }

      if (requested.has("social")) {
        const [postRows, commentRows, likeRows, followingRows, followerRows] =
          await Promise.all([
            db.select().from(posts).where(eq(posts.userId, userId)),
            db.select().from(comments).where(eq(comments.userId, userId)),
            db.select().from(likes).where(eq(likes.userId, userId)),
            db.select().from(follows).where(eq(follows.followerId, userId)),
            db.select().from(follows).where(eq(follows.followingId, userId)),
          ]);
        output.social = {
          posts: postRows,
          comments: commentRows,
          likes: likeRows,
          following: followingRows,
          followers: followerRows,
        };
      }

      if (requested.has("learning")) {
        output.learning = await db
          .select()
          .from(courseProgress)
          .where(eq(courseProgress.userId, userId));
      }

      if (requested.has("feedback")) {
        output.feedback = await db
          .select()
          .from(betaFeedback)
          .where(eq(betaFeedback.userId, userId));
      }

      if (requested.has("discovery")) {
        const [bookmarks, history] = await Promise.all([
          db
            .select()
            .from(discoveryBookmarks)
            .where(eq(discoveryBookmarks.userId, userId)),
          db
            .select()
            .from(searchHistory)
            .where(eq(searchHistory.userId, userId)),
        ]);
        output.discovery = { bookmarks, searchHistory: history };
      }

      if (requested.has("creator")) {
        output.creator = await db
          .select()
          .from(creatorEvidenceDrafts)
          .where(eq(creatorEvidenceDrafts.userId, userId));
      }

      if (requested.has("notifications")) {
        const [notificationRows, preference] = await Promise.all([
          db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId)),
          db.query.notificationPreferences.findFirst({
            where: eq(notificationPreferences.userId, userId),
          }),
        ]);
        output.notifications = {
          notifications: notificationRows,
          preferences: preference ?? null,
        };
      }

      if (requested.has("privacy_requests")) {
        output.privacyRequests = await db
          .select()
          .from(privacyRequests)
          .where(eq(privacyRequests.userId, userId))
          .orderBy(desc(privacyRequests.requestedAt));
      }

      return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        subjectId: userId,
        categories,
        scope:
          "Authenticated SKYCOIN4444 engineering-beta data held in the currently integrated account/profile, social, learning, feedback, discovery, creator, notification, and privacy-request tables. This is not a claim of exhaustive export across unintegrated legacy/provider systems.",
        data: output,
      };
    }),

  myRequests: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(privacyRequests)
      .where(eq(privacyRequests.userId, ctx.user.id))
      .orderBy(desc(privacyRequests.requestedAt));
  }),

  requestDeletion: protectedProcedure
    .input(
      z.object({
        reason: z.string().trim().max(500).optional(),
        confirmation: z.literal("DELETE MY BETA ACCOUNT"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const active = await db.query.privacyRequests.findFirst({
        where: and(
          eq(privacyRequests.userId, ctx.user.id),
          inArray(privacyRequests.status, ["requested", "approved"])
        ),
      });
      if (active) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An active deletion request already exists for this account",
        });
      }

      const now = new Date();
      const domain = createPrivacyRequest({
        id: `privacy_${randomUUID()}`,
        subjectId: ctx.user.id,
        action: "delete",
        requestedAt: now.toISOString(),
        reason: input.reason,
      });

      await db.insert(privacyRequests).values({
        id: domain.id,
        userId: domain.subjectId,
        action: domain.action,
        status: domain.status,
        reason: domain.reason ?? null,
        requestedAt: now,
        updatedAt: now,
      });

      return {
        id: domain.id,
        status: domain.status,
        requestedAt: domain.requestedAt,
        message:
          "Deletion request recorded. This does not mean your account data has been erased yet. Beta operations must verify and execute a purge before completion can be claimed.",
      };
    }),

  adminQueue: adminProcedure.query(async () => {
    return db
      .select()
      .from(privacyRequests)
      .orderBy(desc(privacyRequests.requestedAt))
      .limit(200);
  }),

  adminReview: adminProcedure
    .input(
      z.object({
        requestId: z.string().min(1).max(255),
        decision: z.enum(["approved", "rejected"]),
        operatorNote: z.string().trim().min(1).max(1000),
      })
    )
    .mutation(async ({ input }) => {
      const row = await db.query.privacyRequests.findFirst({
        where: eq(privacyRequests.id, input.requestId),
      });
      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Privacy request not found",
        });
      }

      const current = {
        id: row.id,
        subjectId: row.userId,
        action: row.action as "delete",
        status: normalizePrivacyStatus(row.status),
        requestedAt: row.requestedAt.toISOString(),
        reason: row.reason ?? undefined,
      };
      const next = transitionPrivacyRequest(current, input.decision);

      await db
        .update(privacyRequests)
        .set({
          status: next.status,
          operatorNote: input.operatorNote,
          updatedAt: new Date(),
        })
        .where(eq(privacyRequests.id, input.requestId));

      return {
        requestId: input.requestId,
        status: next.status,
        completionSupported: false,
        message:
          "Request reviewed. This API intentionally cannot mark deletion completed because no verified account purge operation is implemented yet.",
      };
    }),
});
