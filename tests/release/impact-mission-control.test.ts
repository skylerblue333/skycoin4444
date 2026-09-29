import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildHopeAICoachBrief,
  createImpactGameChallenge,
  createImpactMission,
  createSocialImpactShareDraft,
  evaluateCharityMissionReadiness,
} from "../../server/features/impact-missions/index";
import {
  DonationLedger,
  createDonationAcknowledgement,
} from "../../packages/sky-donations/src/index";
import {
  buildQuizSession,
  gradeQuizSession,
} from "../../packages/sky-question-bank/src/index";

const app = fs.readFileSync("client/src/App.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8",
);
const experienceAreas = fs.readFileSync(
  "client/src/data/betaExperienceAreas.ts",
  "utf8",
);
const impactHub = fs.readFileSync("client/src/pages/ImpactHub.tsx", "utf8");
const charityGaming = fs.readFileSync(
  "client/src/pages/GamingForCharity.tsx",
  "utf8",
);

const mission = createImpactMission({
  id: "release:impact:1",
  title: "Impact release contract",
  cause: "education",
  objective:
    "Prove HopeAI, charity, education, social, and gaming can share one truthful workflow.",
  beneficiaryId: "charity:release",
  areas: ["hopeai", "education", "social", "gaming", "charity"],
});

describe("Impact Mission Control release contract", () => {
  it("registers Impact Hub as a first-class app and SkyHope navigation path", () => {
    expect(app).toContain('import("./pages/ImpactHub")');
    expect(app).toContain('<Route path="/impact-hub" component={ImpactHub} />');
    expect(navigation).toContain('{ label: "HopeAI", route: "/hope-a-i"');
    expect(navigation).toContain('{ label: "Impact", route: "/impact-hub"');
    expect(navigation).toContain('{ label: "School", route: "/sky-school"');
    expect(experienceAreas).toContain('route: "/impact-hub"');
    expect(experienceAreas).toContain(
      '{ label: "Impact Play", route: "/gaming-for-charity"',
    );
  });

  it("makes HopeAI useful for impact planning without manufacturing an AI call", () => {
    const brief = buildHopeAICoachBrief(
      mission,
      "Build a one-week volunteer and learning plan.",
    );
    expect(brief.specialistRoles).toEqual([
      "mission-planner",
      "teacher",
      "community-coordinator",
      "impact-analyst",
      "safety-reviewer",
    ]);
    expect(brief.providerExecutionRequired).toBe(true);
    expect(brief.aiCallPerformed).toBe(false);
    expect(impactHub).toMatch(/HopeAI mission brief/);
    expect(impactHub).toMatch(/Open HopeAI/);
  });

  it("keeps social impact output as an explicit draft", () => {
    expect(
      createSocialImpactShareDraft(
        mission,
        "We completed our planning session and are inviting volunteers.",
      ),
    ).toMatchObject({
      posted: false,
      donationClaimMade: false,
      suggestedRoute: "/activity-feed",
    });
    expect(impactHub).toMatch(/Social mission draft/);
    expect(impactHub).toMatch(/Never fabricate reach or results/);
  });

  it("keeps gaming challenges demo-only and connected to the wider impact path", () => {
    expect(
      createImpactGameChallenge(mission, {
        gameRoute: "/game-crypto-quiz",
        targetScore: 750,
        educationalPrompt: "Explain one thing you learned after the round.",
      }),
    ).toMatchObject({
      financialReward: false,
      wagerCreated: false,
      donationTriggered: false,
    });
    expect(charityGaming).toContain('href="/impact-hub"');
    expect(charityGaming).toMatch(/Build an impact mission/);
  });

  it("fails charity readiness closed when external finance evidence is incomplete", () => {
    expect(
      evaluateCharityMissionReadiness({
        beneficiaryVerified: true,
        evidencePlanDefined: true,
        financialActionRequested: true,
        financePolicyApproved: false,
        externalProviderApproved: false,
      }),
    ).toEqual({
      ready: false,
      reasons: [
        "finance-policy-not-approved",
        "external-provider-not-approved",
      ],
      financialExecutionAllowedByThisModule: false,
      providerHandoffRequired: true,
    });
  });

  it("adds idempotent donation recording without pretending payment settled", () => {
    const ledger = new DonationLedger();
    const input = {
      id: "release-donation-1",
      donorId: "user-release",
      campaignId: "campaign-release",
      amountMinor: 5000,
      currency: "USD",
      createdAt: "2026-09-29T08:00:00Z",
    };

    const first = ledger.pledge(input, "release-request-1");
    const replay = ledger.pledge(input, "release-request-1");
    expect(replay).toEqual(first);
    expect(createDonationAcknowledgement(first)).toMatchObject({
      paymentExecutedBySkycoin4444: false,
      settlementVerified: false,
      taxReceipt: false,
    });
  });

  it("adds deterministic education sessions without exposing answer keys or issuing credentials", () => {
    const questions = [
      {
        id: "impact-q1",
        prompt: "Which statement is evidence-aware?",
        choices: [
          "A plan proves impact",
          "Observed activity and verified outcomes are different",
        ],
        correctIndex: 1,
        tags: ["impact"],
      },
      {
        id: "impact-q2",
        prompt: "What does a demo game score prove?",
        choices: ["Gameplay only", "A donation settled"],
        correctIndex: 0,
        tags: ["impact"],
      },
    ];
    const session = buildQuizSession(questions, {
      id: "impact-session",
      tag: "impact",
      limit: 2,
      seed: "release",
    });
    expect(session.answerKeysExposed).toBe(false);
    expect(session.questions.every(item => !("correctIndex" in item))).toBe(true);

    const definitions = new Map(questions.map(item => [item.id, item]));
    const result = gradeQuizSession(
      questions,
      session,
      session.questions.map(item => ({
        questionId: item.id,
        selectedIndex: definitions.get(item.id)!.correctIndex,
      })),
    );
    expect(result).toMatchObject({
      answered: 2,
      correct: 2,
      scorePercent: 100,
      credentialIssued: false,
      persistencePerformed: false,
    });
  });

  it("keeps the UI boundary explicit across HopeAI, social, games, education, and charity", () => {
    for (const marker of [
      "No AI provider call is made from this planner.",
      "No social post is auto-published.",
      "No game score triggers money.",
      "No donation, payment, custody, or settlement is executed here.",
      "Education",
      "Games for impact",
      "Charity controls",
      "Evidence over hype",
    ]) {
      expect(impactHub).toContain(marker);
    }
  });
});
