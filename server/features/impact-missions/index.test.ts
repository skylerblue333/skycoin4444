import { describe, expect, it } from "vitest";
import {
  IMPACT_MISSION_BOUNDARY,
  buildHopeAICoachBrief,
  buildMissionDashboard,
  createImpactGameChallenge,
  createImpactLearningPlan,
  createImpactMission,
  createSocialImpactShareDraft,
  evaluateCharityMissionReadiness,
  planImpactMissionRoutes,
  recordMissionEvidence,
} from "./index";

const mission = createImpactMission({
  id: "mission:hope:001",
  title: "Community learning drive",
  cause: "education access",
  objective:
    "Teach a short digital safety lesson, invite volunteers, and use a demo game challenge to keep participation fun.",
  beneficiaryId: "charity:001",
  areas: ["charity", "gaming", "social", "education", "hopeai"],
});

describe("impact mission orchestration", () => {
  it("normalizes a cross-ecosystem mission without claiming an external action", () => {
    expect(mission).toMatchObject({
      contract: "sky.impact.mission.v1",
      areas: ["hopeai", "education", "social", "gaming", "charity"],
      financialExecutionBySkycoin4444: false,
      externalActionPerformed: false,
    });
  });

  it("builds one ordered navigation step for every selected area", () => {
    expect(planImpactMissionRoutes(mission).map(step => step.route)).toEqual([
      "/hope-a-i",
      "/sky-school",
      "/activity-feed",
      "/gaming-for-charity",
      "/charity",
    ]);
  });

  it("creates a HopeAI multi-specialist brief without claiming an AI call", () => {
    const brief = buildHopeAICoachBrief(
      mission,
      "Give me a practical plan that volunteers could complete this week.",
    );
    expect(brief.specialistRoles).toHaveLength(5);
    expect(brief.specialistRoles).toContain("safety-reviewer");
    expect(brief.providerExecutionRequired).toBe(true);
    expect(brief.aiCallPerformed).toBe(false);
    expect(brief.requestedOutputs).toContain("impact evidence checklist");
  });

  it("fails charity readiness closed on missing evidence and provider gates", () => {
    expect(
      evaluateCharityMissionReadiness({
        beneficiaryVerified: true,
        evidencePlanDefined: false,
        financialActionRequested: true,
        financePolicyApproved: true,
        externalProviderApproved: false,
      }),
    ).toEqual({
      ready: false,
      reasons: ["evidence-plan-required", "external-provider-not-approved"],
      financialExecutionAllowedByThisModule: false,
      providerHandoffRequired: true,
    });
  });

  it("makes social output a draft rather than a fake post or donation claim", () => {
    expect(
      createSocialImpactShareDraft(
        mission,
        "We completed the first learning session and are collecting feedback.",
      ),
    ).toMatchObject({
      suggestedRoute: "/activity-feed",
      posted: false,
      donationClaimMade: false,
    });
  });

  it("turns gaming into a non-financial awareness challenge", () => {
    expect(
      createImpactGameChallenge(mission, {
        gameRoute: "/game-crypto-quiz",
        targetScore: 900,
        educationalPrompt:
          "After the round, explain one privacy habit you can use this week.",
      }),
    ).toMatchObject({
      targetScore: 900,
      financialReward: false,
      wagerCreated: false,
      donationTriggered: false,
    });
    expect(() =>
      createImpactGameChallenge(mission, {
        gameRoute: "/untrusted-casino",
        targetScore: 1,
        educationalPrompt: "test",
      }),
    ).toThrow("unsupported impact game route");
  });

  it("creates education plans without inventing credentials or completion proof", () => {
    expect(
      createImpactLearningPlan(mission, {
        lessonRoute: "/cybersecurity-training",
        quizTag: "security",
        reflectionPrompt:
          "Write down one habit you will change after completing this lesson.",
      }),
    ).toMatchObject({
      credentialIssued: false,
      completionVerifiedExternally: false,
    });
  });

  it("records bounded evidence and never upgrades it into verified impact", () => {
    const learning = recordMissionEvidence(mission, {
      id: "evidence:1",
      kind: "learning-completion",
      trust: "system-observed",
      summary: "Local beta recorded the lesson completion event.",
      occurredAt: "2026-09-29T08:00:00.000Z",
    });
    const game = recordMissionEvidence(mission, {
      id: "evidence:2",
      kind: "game-score",
      trust: "system-observed",
      summary: "The demo challenge recorded a score of 920.",
      occurredAt: "2026-09-29T08:05:00.000Z",
    });

    expect(buildMissionDashboard(mission, [learning, game])).toEqual({
      missionId: mission.id,
      totalEvidence: 2,
      learningSignals: 1,
      communitySignals: 0,
      gamingSignals: 1,
      donationRecords: 0,
      externallyVerifiedEvidence: 0,
      financialSettlementProven: false,
    });
  });

  it("publishes the platform truth boundary explicitly", () => {
    expect(IMPACT_MISSION_BOUNDARY.executesAIProviderCalls).toBe(false);
    expect(IMPACT_MISSION_BOUNDARY.postsToSocialNetworks).toBe(false);
    expect(IMPACT_MISSION_BOUNDARY.executesDonations).toBe(false);
    expect(IMPACT_MISSION_BOUNDARY.createsWagers).toBe(false);
    expect(IMPACT_MISSION_BOUNDARY.verifiesExternalEvidence).toBe(false);
  });
});
