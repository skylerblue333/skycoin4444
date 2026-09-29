import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  CHARITY_GAMING_FINANCE_BOUNDARY,
  evaluateCharityGamingFinance,
  type CharityFinanceContext,
  type CharityGamingFinancialAction,
} from "../features/charity-gaming-finance";

export const CHARITY_FINANCE_ACTIONS = [
  "deposit",
  "withdrawal",
  "real-money-wager",
  "custody",
  "token-settlement",
  "redeemable-crypto-reward",
] as const satisfies readonly CharityGamingFinancialAction[];

export const SKYHOPE_IMPACT_MISSIONS = [
  {
    id: "education-access",
    title: "Education access sprint",
    theme: "education",
    summary:
      "Learn a topic, ask HopeAI to turn it into a volunteer-ready explanation, then practice recall in a no-value quiz.",
    learningRoute: "/sky-school",
    coachRoute: "/hope-a-i",
    practiceRoute: "/game-crypto-quiz",
    evidence:
      "Lesson completion can be persisted to the signed-in beta account. The mission does not create a donation or credential.",
  },
  {
    id: "digital-safety",
    title: "Digital safety clinic",
    theme: "safety",
    summary:
      "Use authored learning material and HopeAI planning to prepare a plain-language digital-safety teaching session.",
    learningRoute: "/course-catalog",
    coachRoute: "/hope-a-i",
    practiceRoute: "/arcade",
    evidence:
      "Practice scores remain game-only. External workshop delivery and attendance are not tracked by this beta.",
  },
  {
    id: "community-build",
    title: "Community build challenge",
    theme: "community",
    summary:
      "Turn a learning goal into a small community project plan and use the Block Builder game as a teamwork-themed rehearsal.",
    learningRoute: "/sky-school",
    coachRoute: "/hope-a-i",
    practiceRoute: "/game-block-builder",
    evidence:
      "The platform can organize the plan and learning evidence; it does not claim that a real-world project was completed.",
  },
  {
    id: "impact-story",
    title: "Impact story workshop",
    theme: "communication",
    summary:
      "Study a topic, draft an evidence-led story with HopeAI, then move into the creator tools without inventing reach or fundraising results.",
    learningRoute: "/course-catalog",
    coachRoute: "/hope-a-i",
    practiceRoute: "/creator-dashboard",
    evidence:
      "Published reach, donations, partner approval, and beneficiary outcomes require separate real evidence.",
  },
] as const;

const actionSchema = z.enum(CHARITY_FINANCE_ACTIONS);

export const charityFinanceInputSchema = z.object({
  action: actionSchema,
  beneficiaryId: z.string().trim().min(1).max(128),
  beneficiaryVerified: z.boolean(),
  charityOnly: z.literal(true).default(true),
  paymentProviderApproved: z.boolean(),
  legalReviewApproved: z.boolean(),
  regionAllowed: z.boolean(),
  ageGatePassed: z.boolean(),
  regulatedGamingProviderApproved: z.boolean(),
});

type CharityBooleanGateKey =
  | "beneficiaryVerified"
  | "paymentProviderApproved"
  | "legalReviewApproved"
  | "regionAllowed"
  | "ageGatePassed"
  | "regulatedGamingProviderApproved";

type CharityGateResult = Readonly<{
  key: CharityBooleanGateKey;
  label: string;
  passed: boolean;
}>;

const gateLabels: readonly [
  Exclude<
    CharityBooleanGateKey,
    "ageGatePassed" | "regulatedGamingProviderApproved"
  >,
  string,
][] = [
  ["beneficiaryVerified", "Verified charity beneficiary"],
  ["paymentProviderApproved", "Approved external payment/custody provider"],
  ["legalReviewApproved", "Legal review approved"],
  ["regionAllowed", "Region allowed"],
];

export const charityImpactRouter = router({
  boundary: publicProcedure.query(() => ({
    contract: "sky.charity-impact.boundary.v1" as const,
    ...CHARITY_GAMING_FINANCE_BOUNDARY,
    liveDonationExecution: false as const,
    externalBeneficiaryVerification: false as const,
    financeEvaluationMode: "hypothetical-simulation" as const,
    providerHandoffAuthorization: false as const,
    missionCount: SKYHOPE_IMPACT_MISSIONS.length,
  })),

  missions: publicProcedure.query(() => SKYHOPE_IMPACT_MISSIONS),

  create: protectedProcedure
    .input(z.record(z.string(), z.unknown()))
    .mutation(() => {
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message:
          "Charity create API is not implemented yet; use SkyHope planning without claiming a live financial campaign.",
      });
    }),

  evaluateFinance: publicProcedure
    .input(charityFinanceInputSchema)
    .query(({ input }) => {
      const context: CharityFinanceContext = {
        beneficiaryId: input.beneficiaryId,
        beneficiaryVerified: input.beneficiaryVerified,
        charityOnly: true,
        paymentProviderApproved: input.paymentProviderApproved,
        legalReviewApproved: input.legalReviewApproved,
        regionAllowed: input.regionAllowed,
        ageGatePassed: input.ageGatePassed,
        regulatedGamingProviderApproved:
          input.regulatedGamingProviderApproved,
      };
      const decision = evaluateCharityGamingFinance(input.action, context);
      const requiredGates: CharityGateResult[] = gateLabels.map(
        ([key, label]) => ({
          key,
          label,
          passed: context[key],
        }),
      );

      if (input.action === "real-money-wager") {
        requiredGates.push(
          {
            key: "ageGatePassed",
            label: "Age gate passed",
            passed: context.ageGatePassed,
          },
          {
            key: "regulatedGamingProviderApproved",
            label: "Approved regulated gaming provider",
            passed: context.regulatedGamingProviderApproved,
          },
        );
      }

      return {
        contract: "sky.charity-impact.finance-simulation.v1" as const,
        hypotheticalDecision: decision,
        requiredGates,
        simulationOnly: true as const,
        trustedVerificationSource: false as const,
        authorizesProviderHandoff: false as const,
        liveExecution: false as const,
      };
    }),
});
