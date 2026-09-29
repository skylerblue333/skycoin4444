import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  arcadeGameProgress,
  charityPledges,
  charityVolunteerActions,
  courseProgress,
  posts,
} from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { evaluateContribution, type Campaign } from "../features/fundraising";
import { buildEcosystemJourney } from "../features/ecosystem-journey";

export const SKYHOPE_CAMPAIGNS = [
  {
    id: "education-access",
    title: "Education Access",
    description:
      "Support planning for learning materials, tutoring time, and community education projects.",
    category: "Education",
    goalMinor: 2500000,
    currency: "USD",
    status: "active",
    beneficiaryLabel: "Community education initiatives",
  },
  {
    id: "shelter-support",
    title: "Shelter & Essentials",
    description:
      "Track pledges and volunteer effort for shelter, meals, hygiene kits, and essential-needs projects.",
    category: "Community",
    goalMinor: 1500000,
    currency: "USD",
    status: "active",
    beneficiaryLabel: "Community support initiatives",
  },
  {
    id: "emergency-readiness",
    title: "Emergency Readiness",
    description:
      "Organize non-custodial pledge intent and volunteer preparation for emergency-response projects.",
    category: "Humanitarian",
    goalMinor: 3000000,
    currency: "USD",
    status: "active",
    beneficiaryLabel: "Emergency-response initiatives",
  },
] as const;

type CampaignId = (typeof SKYHOPE_CAMPAIGNS)[number]["id"];

const campaignIdSchema = z.enum(
  SKYHOPE_CAMPAIGNS.map(campaign => campaign.id) as [CampaignId, ...CampaignId[]],
);

const actionTypeSchema = z.enum([
  "service",
  "education",
  "outreach",
  "fundraising-prep",
  "community-support",
]);

function isImpactTableUnavailable(error: unknown): boolean {
  const candidate = error as { code?: unknown; errno?: unknown; message?: unknown };
  const message = String(candidate?.message ?? "");
  return (
    candidate?.code === "ER_NO_SUCH_TABLE" ||
    candidate?.errno === 1146 ||
    message.includes("charity_pledges") ||
    message.includes("charity_volunteer_actions")
  );
}

function campaignById(id: CampaignId) {
  const campaign = SKYHOPE_CAMPAIGNS.find(item => item.id === id);
  if (!campaign) throw new Error("unknown SkyHope campaign");
  return campaign;
}

function campaignForDomain(id: CampaignId, pledgedMinor: number): Campaign {
  const campaign = campaignById(id);
  return {
    id: campaign.id,
    title: campaign.title,
    goalMinor: campaign.goalMinor,
    raisedMinor: pledgedMinor,
    currency: campaign.currency,
    status: campaign.status,
  };
}

async function readCampaignPledgeRows() {
  try {
    const rows = await db
      .select({
        campaignId: charityPledges.campaignId,
        amountMinor: charityPledges.amountMinor,
        status: charityPledges.status,
      })
      .from(charityPledges);
    return { rows, persistenceReady: true as const };
  } catch (error) {
    if (isImpactTableUnavailable(error)) {
      return { rows: [], persistenceReady: false as const };
    }
    throw error;
  }
}

async function readUserImpact(userId: string) {
  try {
    const [pledges, volunteerActions] = await Promise.all([
      db
        .select({
          id: charityPledges.id,
          campaignId: charityPledges.campaignId,
          amountMinor: charityPledges.amountMinor,
          currency: charityPledges.currency,
          status: charityPledges.status,
          createdAt: charityPledges.createdAt,
        })
        .from(charityPledges)
        .where(eq(charityPledges.userId, userId))
        .orderBy(desc(charityPledges.createdAt)),
      db
        .select({
          id: charityVolunteerActions.id,
          campaignId: charityVolunteerActions.campaignId,
          actionType: charityVolunteerActions.actionType,
          minutes: charityVolunteerActions.minutes,
          note: charityVolunteerActions.note,
          createdAt: charityVolunteerActions.createdAt,
        })
        .from(charityVolunteerActions)
        .where(eq(charityVolunteerActions.userId, userId))
        .orderBy(desc(charityVolunteerActions.createdAt)),
    ]);
    return { pledges, volunteerActions, persistenceReady: true as const };
  } catch (error) {
    if (isImpactTableUnavailable(error)) {
      return {
        pledges: [],
        volunteerActions: [],
        persistenceReady: false as const,
      };
    }
    throw error;
  }
}

async function buildUserJourney(userId: string) {
  const [socialRows, lessonRows, arcadeRows, impact] = await Promise.all([
    db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.userId, userId)),
    db
      .select({ id: courseProgress.id })
      .from(courseProgress)
      .where(eq(courseProgress.userId, userId)),
    db
      .select({ plays: arcadeGameProgress.plays })
      .from(arcadeGameProgress)
      .where(eq(arcadeGameProgress.userId, userId)),
    readUserImpact(userId),
  ]);

  const arcadePlays = arcadeRows.reduce(
    (sum, row) => sum + Math.max(0, row.plays ?? 0),
    0,
  );
  const volunteerMinutes = impact.volunteerActions.reduce(
    (sum, row) => sum + Math.max(0, row.minutes ?? 0),
    0,
  );

  return {
    impact,
    journey: buildEcosystemJourney({
      socialPosts: socialRows.length,
      lessonsCompleted: lessonRows.length,
      arcadePlays,
      charityPledges: impact.pledges.length,
      volunteerMinutes,
    }),
  };
}

export const charityRouter = router({
  campaigns: publicProcedure.query(async () => {
    const pledgeState = await readCampaignPledgeRows();

    return {
      persistenceReady: pledgeState.persistenceReady,
      settlementEnabled: false as const,
      beneficiaryVerificationClaimed: false as const,
      campaigns: SKYHOPE_CAMPAIGNS.map(campaign => {
        const rows = pledgeState.rows.filter(
          row => row.campaignId === campaign.id && row.status === "pledged",
        );
        const pledgedMinor = rows.reduce(
          (sum, row) => sum + Math.max(0, row.amountMinor ?? 0),
          0,
        );
        return {
          ...campaign,
          pledgedMinor,
          pledgeCount: rows.length,
          goalProgressPercent: Math.min(
            100,
            Math.round((pledgedMinor / campaign.goalMinor) * 10000) / 100,
          ),
        };
      }),
    };
  }),

  summary: protectedProcedure.query(async ({ ctx }) => {
    const { impact, journey } = await buildUserJourney(ctx.user.id);
    const pledgedMinor = impact.pledges.reduce(
      (sum, pledge) => sum + Math.max(0, pledge.amountMinor ?? 0),
      0,
    );
    const volunteerMinutes = impact.volunteerActions.reduce(
      (sum, action) => sum + Math.max(0, action.minutes ?? 0),
      0,
    );

    return {
      persistenceReady: impact.persistenceReady,
      pledgeCount: impact.pledges.length,
      pledgedMinor,
      volunteerActionCount: impact.volunteerActions.length,
      volunteerMinutes,
      pledges: impact.pledges.slice(0, 20),
      volunteerActions: impact.volunteerActions.slice(0, 20),
      journey,
      boundaries: {
        paymentExecuted: false as const,
        fundsCustodied: false as const,
        blockchainTransferExecuted: false as const,
        beneficiaryVerificationClaimed: false as const,
        taxDeductibilityClaimed: false as const,
      },
    };
  }),

  journey: protectedProcedure.query(async ({ ctx }) => {
    const { impact, journey } = await buildUserJourney(ctx.user.id);
    return {
      ...journey,
      impactPersistenceReady: impact.persistenceReady,
    };
  }),

  pledge: protectedProcedure
    .input(
      z.object({
        campaignId: campaignIdSchema,
        amountMinor: z.number().int().min(100).max(100_000_000),
        idempotencyKey: z.string().trim().min(8).max(128),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const campaign = campaignById(input.campaignId);
      let existingRows;
      try {
        existingRows = await db
          .select({
            id: charityPledges.id,
            campaignId: charityPledges.campaignId,
            amountMinor: charityPledges.amountMinor,
            currency: charityPledges.currency,
            status: charityPledges.status,
            createdAt: charityPledges.createdAt,
          })
          .from(charityPledges)
          .where(
            and(
              eq(charityPledges.userId, ctx.user.id),
              eq(charityPledges.idempotencyKey, input.idempotencyKey),
            ),
          )
          .limit(1);
      } catch (error) {
        if (isImpactTableUnavailable(error)) {
          throw new TRPCError({
            code: "SERVICE_UNAVAILABLE",
            message:
              "SkyHope impact persistence requires migration 0015_skyhope_impact.sql",
          });
        }
        throw error;
      }

      if (existingRows[0]) {
        return {
          created: false as const,
          pledge: existingRows[0],
          settlementExecuted: false as const,
        };
      }

      const aggregate = await readCampaignPledgeRows();
      if (!aggregate.persistenceReady) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message:
            "SkyHope impact persistence requires migration 0015_skyhope_impact.sql",
        });
      }
      const pledgedMinor = aggregate.rows
        .filter(row => row.campaignId === campaign.id && row.status === "pledged")
        .reduce((sum, row) => sum + Math.max(0, row.amountMinor ?? 0), 0);

      const decision = evaluateContribution(
        campaignForDomain(input.campaignId, pledgedMinor),
        {
          campaignId: campaign.id,
          contributorId: ctx.user.id,
          amountMinor: input.amountMinor,
          currency: campaign.currency,
          idempotencyKey: input.idempotencyKey,
        },
      );
      if (!decision.accepted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pledge rejected: " + (decision.reason ?? "invalid pledge"),
        });
      }

      const id = randomUUID();
      await db.insert(charityPledges).values({
        id,
        userId: ctx.user.id,
        campaignId: campaign.id,
        amountMinor: input.amountMinor,
        currency: campaign.currency,
        status: "pledged",
        idempotencyKey: input.idempotencyKey,
      });

      return {
        created: true as const,
        pledge: {
          id,
          campaignId: campaign.id,
          amountMinor: input.amountMinor,
          currency: campaign.currency,
          status: "pledged" as const,
        },
        projectedCampaignPledgedMinor: decision.projectedRaisedMinor,
        settlementExecuted: false as const,
        paymentProviderCalled: false as const,
      };
    }),

  volunteer: protectedProcedure
    .input(
      z.object({
        campaignId: campaignIdSchema.optional(),
        actionType: actionTypeSchema,
        minutes: z.number().int().min(5).max(1440),
        note: z.string().trim().max(255).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.campaignId) campaignById(input.campaignId);
      const id = randomUUID();
      try {
        await db.insert(charityVolunteerActions).values({
          id,
          userId: ctx.user.id,
          campaignId: input.campaignId ?? null,
          actionType: input.actionType,
          minutes: input.minutes,
          note: input.note || null,
        });
      } catch (error) {
        if (isImpactTableUnavailable(error)) {
          throw new TRPCError({
            code: "SERVICE_UNAVAILABLE",
            message:
              "SkyHope impact persistence requires migration 0015_skyhope_impact.sql",
          });
        }
        throw error;
      }

      return {
        created: true as const,
        action: {
          id,
          campaignId: input.campaignId ?? null,
          actionType: input.actionType,
          minutes: input.minutes,
          note: input.note || null,
        },
        financialValue: false as const,
        volunteerVerificationClaimed: false as const,
      };
    }),
});
