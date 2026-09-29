import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  buildContributionPlan,
  getCharityStats,
  listCharityCampaigns,
} from "../features/charityCore";

const campaignQueryInput = z
  .object({
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(10_000).default(0),
  })
  .optional();

const leaderboardQueryInput = z
  .object({
    limit: z.number().int().min(1).max(100).default(20),
  })
  .optional();

const planInput = z.object({
  campaignId: z.string().trim().min(1).max(120),
  amount: z.number().finite().positive().max(100_000),
});

function planOrBadRequest(input: z.infer<typeof planInput>, actorId: string) {
  try {
    return buildContributionPlan({ ...input, actorId });
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error instanceof Error ? error.message : "invalid charity contribution plan",
    });
  }
}

export const charityRouter = router({
  campaigns: publicProcedure
    .input(campaignQueryInput)
    .query(({ input }) => {
      const campaigns = listCharityCampaigns();
      const offset = input?.offset ?? 0;
      const limit = input?.limit ?? 50;
      return campaigns.slice(offset, offset + limit);
    }),

  stats: publicProcedure.query(() => getCharityStats()),

  // Compatibility boundary for historical leaderboard callers. This beta does
  // not have verified donor records, so it returns no fabricated ranking.
  leaderboard: publicProcedure
    .input(leaderboardQueryInput)
    .query(() => [] as const),

  prepareContribution: protectedProcedure
    .input(planInput)
    .mutation(({ ctx, input }) => planOrBadRequest(input, ctx.user.id)),

  // Compatibility boundary for historical clients. Live donation execution is
  // deliberately disabled rather than returning a fake success.
  donate: protectedProcedure
    .input(planInput)
    .mutation(() => {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message:
          "Live charity donations are not enabled in this engineering beta. Use prepareContribution to create a non-executing plan.",
      });
    }),
});
