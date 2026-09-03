import { and, desc, eq } from "drizzle-orm";
import { betaFeedback, courseProgress, creatorEvidenceDrafts, discoveryBookmarks, posts, searchHistory } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const activityEvidenceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [postRows, courseRows, feedbackRows, bookmarkRows, historyRows, creatorRows] = await Promise.all([
      db.select({ id: posts.id, content: posts.content, createdAt: posts.createdAt }).from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt)).limit(25),
      db.select({ id: courseProgress.id, courseId: courseProgress.courseId, lessonId: courseProgress.lessonId, completedAt: courseProgress.completedAt }).from(courseProgress).where(eq(courseProgress.userId, userId)).orderBy(desc(courseProgress.completedAt)).limit(25),
      db.select({ id: betaFeedback.id, route: betaFeedback.route, summary: betaFeedback.summary, status: betaFeedback.status, createdAt: betaFeedback.createdAt }).from(betaFeedback).where(eq(betaFeedback.userId, userId)).orderBy(desc(betaFeedback.createdAt)).limit(25),
      db.select({ id: discoveryBookmarks.id, title: discoveryBookmarks.title, targetKind: discoveryBookmarks.targetKind, createdAt: discoveryBookmarks.createdAt }).from(discoveryBookmarks).where(eq(discoveryBookmarks.userId, userId)).orderBy(desc(discoveryBookmarks.createdAt)).limit(25),
      db.select({ id: searchHistory.id, query: searchHistory.query, createdAt: searchHistory.createdAt }).from(searchHistory).where(eq(searchHistory.userId, userId)).orderBy(desc(searchHistory.createdAt)).limit(25),
      db.select({ id: creatorEvidenceDrafts.id, title: creatorEvidenceDrafts.title, status: creatorEvidenceDrafts.status, updatedAt: creatorEvidenceDrafts.updatedAt }).from(creatorEvidenceDrafts).where(eq(creatorEvidenceDrafts.userId, userId)).orderBy(desc(creatorEvidenceDrafts.updatedAt)).limit(25),
    ]);
    const events = [
      ...postRows.map(row => ({ id: `post:${row.id}`, type: "post_created", label: "Published a post", detail: row.content || "Post content is not available", createdAt: row.createdAt ?? new Date(0) })),
      ...courseRows.map(row => ({ id: `lesson:${row.id}`, type: "lesson_completed", label: "Completed a lesson", detail: `${row.courseId} · ${row.lessonId}`, createdAt: row.completedAt })),
      ...feedbackRows.map(row => ({ id: `feedback:${row.id}`, type: "feedback_submitted", label: "Submitted beta feedback", detail: `${row.route} · ${row.summary} · ${row.status}`, createdAt: row.createdAt ?? new Date(0) })),
      ...bookmarkRows.map(row => ({ id: `bookmark:${row.id}`, type: "bookmark_saved", label: "Saved a discovery reference", detail: `${row.targetKind} · ${row.title}`, createdAt: row.createdAt })),
      ...historyRows.map(row => ({ id: `search:${row.id}`, type: "search_recorded", label: "Recorded a search", detail: row.query, createdAt: row.createdAt })),
      ...creatorRows.map(row => ({ id: `creator:${row.id}`, type: "creator_draft_updated", label: "Updated a creator brief", detail: `${row.title} · ${row.status}`, createdAt: row.updatedAt })),
    ];
    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 50);
  }),
});
