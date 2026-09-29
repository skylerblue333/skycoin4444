import fs from "node:fs";
import { describe, expect, it } from "vitest";

const routers = fs.readFileSync("server/routers.ts", "utf8");
const impactRouter = fs.readFileSync(
  "server/routers/charityImpact.ts",
  "utf8"
);
const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const impactPlay = fs.readFileSync(
  "client/src/pages/GamingForCharity.tsx",
  "utf8"
);
const school = fs.readFileSync("client/src/pages/SkySchool.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);
const dashboard = fs.readFileSync("client/src/pages/Dashboard.tsx", "utf8");

describe("SkyHope impact integration", () => {
  it("replaces the unavailable charity namespace with the real impact router", () => {
    expect(routers).toMatch(
      /import \{ charityImpactRouter \} from "\.\/routers\/charityImpact"/
    );
    expect(routers).toMatch(/charity:charityImpactRouter/);
    expect(routers).not.toMatch(
      /charity:createUnavailableFeatureRouter\("Charity"\)/
    );

    expect(impactRouter).toMatch(/SKYHOPE_IMPACT_MISSIONS/);
    expect(impactRouter).toMatch(/evaluateCharityGamingFinance/);
    expect(impactRouter).toMatch(/liveDonationExecution: false/);
    expect(impactRouter).toMatch(/externalBeneficiaryVerification: false/);
    expect(impactRouter).toMatch(/financeEvaluationMode: "hypothetical-simulation"/);
    expect(impactRouter).toMatch(/authorizesProviderHandoff: false/);
    expect(impactRouter).toMatch(/trustedVerificationSource: false/);
  });

  it("removes fabricated charity execution and rankings from the flagship impact screen", () => {
    expect(charity).toMatch(/SkyHope Impact/);
    expect(charity).toMatch(/trpc\.charity\.missions\.useQuery/);
    expect(charity).toMatch(/trpc\.charity\.evaluateFinance\.useQuery/);
    expect(charity).toMatch(/No live donations/);
    expect(charity).toMatch(/Simulation only/);
    expect(charity).toMatch(/no handoff authorized/i);
    expect(charity).toMatch(/self-attested/i);

    for (const fabricatedMarker of [
      "DAO_PROPOSALS",
      "LEADERBOARD",
      "trpc.charity.donate",
      "WaterAid verified",
      "On-chain verified",
      "100% of donations go directly",
    ]) {
      expect(charity).not.toContain(fabricatedMarker);
    }
  });

  it("connects learning games HopeAI and impact through shared mission paths", () => {
    expect(impactPlay).toMatch(/trpc\.charity\.missions\.useQuery/);
    expect(impactPlay).toMatch(/No live donations/);
    expect(impactPlay).toMatch(/Open SkyHope Impact/);
    expect(school).toMatch(/SkyHope Impact Lab/);
    expect(school).toMatch(/href="\/charity"/);
    expect(school).toMatch(/Ask HopeAI Coach/);
  });

  it("promotes the major product paths in navigation and dashboard entry points", () => {
    for (const route of [
      "/hope-a-i",
      "/activity-feed",
      "/gaming",
      "/sky-school",
      "/charity",
    ]) {
      expect(navigation).toContain(route);
      expect(dashboard).toContain(route);
    }

    expect(navigation).toMatch(
      /label: "School", route: "\/sky-school", icon: BookOpen/
    );
    expect(navigation).toMatch(
      /label: "Impact", route: "\/charity", icon: HeartHandshake/
    );
  });
});
