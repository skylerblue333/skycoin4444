import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routers = readFileSync("server/routers.ts", "utf8");
const charityRouter = readFileSync("server/routers/charity.ts", "utf8");
const journey = readFileSync("server/features/ecosystem-journey/index.ts", "utf8");
const charityPage = readFileSync("client/src/pages/Charity.tsx", "utf8");
const charityImpactPanel = readFileSync("client/src/components/SkyHopeAccountImpactPanel.tsx", "utf8");
const betaJourney = readFileSync("client/src/pages/BetaJourney.tsx", "utf8");
const navigation = readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const home = readFileSync("client/src/pages/Home.tsx", "utf8");
const migrationRunner = readFileSync("scripts/migrate-skyhope-impact.mjs", "utf8");

describe("HopeAI social gaming education SkyHope integration", () => {
  it("replaces the dead charity namespace with a real router", () => {
    expect(routers).toContain('import { charityRouter } from "./routers/charity"');
    expect(routers).toContain("charity:charityRouter");
    expect(routers).not.toContain('charity:createUnavailableFeatureRouter("Charity")');
    expect(charityRouter).toContain("pledge: protectedProcedure");
    expect(charityRouter).toContain("volunteer: protectedProcedure");
    expect(charityRouter).toContain("journey: protectedProcedure");
  });

  it("builds journey evidence from social learning gaming and impact persistence", () => {
    expect(charityRouter).toContain("posts");
    expect(charityRouter).toContain("courseProgress");
    expect(charityRouter).toContain("arcadeGameProgress");
    expect(charityRouter).toContain("charityPledges");
    expect(charityRouter).toContain("charityVolunteerActions");
    expect(journey).toContain('"social" | "learn" | "play" | "impact"');
    expect(journey).toContain('route: "/hope-a-i"');
    expect(journey).toContain("persistedCompletionTracked: false");
  });

  it("combines the truthful planning workspace with persisted account impact evidence", () => {
    expect(charityPage).toContain("SkyHopeAccountImpactPanel");
    expect(charityPage).toContain("No live donations or custody");
    expect(charityPage).not.toContain("Diamond Donor");
    expect(charityPage).not.toContain("votesFor");
    expect(charityPage).not.toContain("100% of donations go directly");
    expect(charityPage).not.toContain("On-chain verified");
    expect(charityImpactPanel).toContain("trpc.charity.campaigns.useQuery");
    expect(charityImpactPanel).toContain("trpc.charity.summary.useQuery");
    expect(charityImpactPanel).toContain("trpc.charity.pledge.useMutation");
    expect(charityImpactPanel).toContain("trpc.charity.volunteer.useMutation");
    expect(charityImpactPanel).toContain("No payment execution");
  });

  it("routes legacy impact screens to one truthful SkyHope center", () => {
    for (const path of [
      "client/src/pages/CharityLeaderboard.tsx",
      "client/src/pages/ImpactMap.tsx",
      "client/src/pages/ImpactMetrics.tsx",
      "client/src/pages/DonationProcessing.tsx",
      "client/src/pages/FundraiserTools.tsx",
      "client/src/pages/GamingForCharity.tsx",
    ]) {
      expect(readFileSync(path, "utf8")).toContain('from "./Charity"');
    }
  });

  it("promotes HopeAI SkySchool SkyHope and the connected journey in navigation", () => {
    expect(navigation).toContain('{ label: "School", route: "/sky-school"');
    expect(navigation).toContain('{ label: "HopeAI", route: "/hope-a-i"');
    expect(navigation).toContain('{ label: "SkyHope", route: "/charity"');
    expect(navigation).toContain('{ label: "Journey", route: "/beta-journey"');
    expect(home).toContain('title: "SkyHope"');
    expect(home).toContain('href: "/beta-journey"');
    expect(betaJourney).toContain("trpc.charity.journey.useQuery");
    expect(betaJourney).toContain("Social → Learn → Play → Help → HopeAI");
  });

  it("uses a guarded additive production migration", () => {
    expect(migrationRunner).toContain('const CONFIRMATION = "SKYHOPE_IMPACT_V1"');
    expect(migrationRunner).toContain("CREATE TABLE IF NOT EXISTS charity_pledges");
    expect(migrationRunner).toContain("CREATE TABLE IF NOT EXISTS charity_volunteer_actions");
    expect(migrationRunner).toContain("refuses localhost");
    expect(migrationRunner).toContain("verification failed");
  });
});
