import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../_core/trpc";
import {
  getSkyHopeStats,
  listSkyHopeCampaigns,
  listSkyHopeVolunteerOpportunities,
  planSkyHopePledge,
  SKYHOPE_BETA_BOUNDARY,
} from "../features/skyhope";

const categoryInput = z
  .object({
    category: z.string().trim().min(1).max(64).optional(),
  })
  .default({});

const pledgeInput = z.object({
  campaignId: z.string().trim().min(1).max(120),
  amountMinor: z.number().int().positive().max(100_000_000),
  idempotencyKey: z.string().trim().min(8).max(128),
});

export const charityProcedures = {
  campaigns: publicProcedure.input(categoryInput).query(({ input }) => {
    return listSkyHopeCampaigns(input.category);
  }),

  stats: publicProcedure.query(() => getSkyHopeStats()),

  volunteer: publicProcedure.query(() => listSkyHopeVolunteerOpportunities()),

  boundary: publicProcedure.query(() => SKYHOPE_BETA_BOUNDARY),

  planPledge: protectedProcedure.input(pledgeInput).mutation(({ ctx, input }) => {
    return planSkyHopePledge({
      ...input,
      supporterId: String(ctx.user.id),
    });
  }),
};
