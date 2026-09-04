import { eq } from "drizzle-orm";
import { betaFeedback, courseProgress, posts, users } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export type ActivationStepId =
  | "account"
  | "profile"
  | "learning"
  | "social"
  | "feedback";

export type ActivationStatusInput = {
  account: boolean;
  profile: boolean;
  learning: boolean;
  social: boolean;
  feedback: boolean;
};

const stepRoutes: Record<ActivationStepId, string> = {
  account: "/signin",
  profile: "/profile",
  learning: "/course-catalog",
  social: "/activity-feed",
  feedback: "/beta-feedback",
};

export function summarizeActivation(input: ActivationStatusInput) {
  const ordered: ActivationStepId[] = [
    "account",
    "profile",
    "learning",
    "social",
    "feedback",
  ];
  const steps = ordered.map(id => ({
    id,
    complete: input[id],
    route: stepRoutes[id],
  }));
  const completedCount = steps.filter(step => step.complete).length;
  const totalCount = steps.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const next = steps.find(step => !step.complete) ?? null;

  return {
    steps,
    completedCount,
    totalCount,
    percent,
    activated: completedCount === totalCount,
    nextStep: next?.id ?? null,
    nextRoute: next?.route ?? "/activity-evidence",
  };
}

export const activationRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [profile, lesson, post, feedback] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          name: true,
          username: true,
        },
      }),
      db.query.courseProgress.findFirst({
        where: eq(courseProgress.userId, userId),
        columns: { id: true },
      }),
      db.query.posts.findFirst({
        where: eq(posts.userId, userId),
        columns: { id: true },
      }),
      db.query.betaFeedback.findFirst({
        where: eq(betaFeedback.userId, userId),
        columns: { id: true },
      }),
    ]);

    return summarizeActivation({
      account: true,
      profile: Boolean(profile?.name?.trim() && profile?.username?.trim()),
      learning: Boolean(lesson),
      social: Boolean(post),
      feedback: Boolean(feedback),
    });
  }),
});
