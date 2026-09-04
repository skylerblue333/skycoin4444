import fs from "node:fs";
import { describe, expect, it } from "vitest";

const onboarding = fs.readFileSync("client/src/pages/Onboarding.tsx", "utf8");
const journey = fs.readFileSync("client/src/pages/BetaJourney.tsx", "utf8");
const activation = fs.readFileSync("server/routers/activation.ts", "utf8");
const routers = fs.readFileSync("server/routers.ts", "utf8");

describe("durable activation journey", () => {
  it("derives onboarding progress from protected persisted activation evidence", () => {
    expect(onboarding).toMatch(/trpc\.activation\.status\.useQuery/);
    expect(routers).toMatch(/activation:activationRouter/);
    for (const table of [
      "users",
      "courseProgress",
      "posts",
      "betaFeedback",
    ]) {
      expect(activation).toContain(table);
    }
    expect(activation).toMatch(/protectedProcedure\.query/);
    expect(activation).toMatch(/completedCount/);
    expect(activation).toMatch(/nextRoute/);
  });

  it("uses the five real beta activation gates", () => {
    for (const route of [
      "/signin",
      "/profile",
      "/course-catalog",
      "/activity-feed",
      "/beta-feedback",
      "/activity-evidence",
    ]) {
      expect(onboarding).toContain(route);
      expect(journey).toContain(route);
    }
    expect(onboarding).toMatch(/database records, not from\s+clicking/);
    expect(journey).toMatch(/Persisted evidence over page count/);
  });

  it("removes unsupported reward, scale, provider, and governance claims from onboarding", () => {
    for (const unsupported of [
      /Free Airdrop/i,
      /VOTE #1 PASSED/i,
      /Connect with millions/i,
      /Real LLM integration/i,
      /earn staking rewards/i,
      /Multi-token payments/i,
      /real-time leaderboards/i,
      /444\+ commands/i,
      /AIRDROP_TOKENS/,
      /auth_token/,
    ]) {
      expect(onboarding).not.toMatch(unsupported);
    }
  });

  it("states the non-financial and non-provider boundary explicitly", () => {
    expect(onboarding).toMatch(/does not grant token rewards, airdrops/);
    expect(onboarding).toMatch(/wallet custody/);
    expect(onboarding).toMatch(/provider-backed AI/);
    expect(journey).toMatch(/does not issue credentials, token rewards/);
    expect(journey).toMatch(/blockchain\s+transactions/);
  });
});
