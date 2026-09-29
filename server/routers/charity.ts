import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  buildContributionPlan,
  getCharityStats,
  listCharityCampaigns,
} from "../features/charityCore";

const campaignQueryInput = z.object({}).optional();
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
    .query(() => listCharityCampaigns()),

  stats: publicProcedure.query(() => getCharityStats()),

  leaderboard: publicProcedure.query(() => [] as const),

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
