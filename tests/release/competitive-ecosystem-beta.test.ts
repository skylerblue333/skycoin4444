import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ecosystemAreas,
  getEcosystemProgressPercent,
  normalizeEcosystemProgress,
  setEcosystemAreaComplete,
} from "../../client/src/lib/ecosystemBeta";
import {
  buildLanguagePracticePlan,
  commerceSandboxItems,
  normalizeCommerceSandboxCart,
  validateLanguageExchangeProfile,
} from "../../client/src/lib/competitiveLabs";

const liveSource = fs.readFileSync(
  "client/src/pages/LiveStreaming.tsx",
  "utf8"
);
const languageSource = fs.readFileSync(
  "client/src/pages/LanguagePartnerDiscovery.tsx",
  "utf8"
);
const commerceSource = fs.readFileSync(
  "client/src/pages/BetaCommerceSandbox.tsx",
  "utf8"
);
const datingSource = fs.readFileSync(
  "client/src/pages/DatingProfileSetup.tsx",
  "utf8"
);
const auditSource = fs.readFileSync(
  "scripts/audit-screen-portfolio.mjs",
  "utf8"
);
const evidenceRegistry = JSON.parse(
  fs.readFileSync("catalogs/beta-route-evidence.json", "utf8")
);
const arcadeSource = fs.readFileSync("client/src/pages/Arcade.tsx", "utf8");
const gameTests = fs.readFileSync("tests/release/gap-games.test.ts", "utf8");

describe("competitive ecosystem beta", () => {
  it("defines eight truthful ecosystem areas", () => {
    expect(ecosystemAreas.map(area => area.id)).toEqual([
      "social",
      "live",
      "finance",
      "commerce",
      "language",
      "dating",
      "education",
      "gaming",
    ]);
    expect(ecosystemAreas.every(area => area.boundary.startsWith("No "))).toBe(
      true
    );
  });

  it("normalizes and updates browser test progress", () => {
    const normalized = normalizeEcosystemProgress({
      social: true,
      live: "yes",
      unknown: true,
    });
    expect(normalized.social).toBe(true);
    expect(normalized.live).toBe(false);
    const next = setEcosystemAreaComplete(normalized, "live", true);
    expect(getEcosystemProgressPercent(next)).toBe(25);
  });

  it("replaces fake live claims with a real local device preview", () => {
    expect(liveSource).toMatch(/navigator\.mediaDevices\.getUserMedia/);
    expect(liveSource).toMatch(
      /getTracks\(\)\.forEach\(track => track\.stop\(\)\)/
    );
    expect(liveSource).toMatch(/does not upload, broadcast, record/);
    expect(liveSource).not.toMatch(/802K\+|2\.4M|99\.9%|45ms/);
  });

  it("builds a balanced language plan without fake partners", () => {
    const profile = {
      nativeLanguage: "English",
      learningLanguage: "Spanish",
      level: "B1" as const,
      sessionMinutes: 30 as const,
      availability: "Saturday",
      goals: "Practice ordering food",
      topics: "Travel",
    };
    expect(validateLanguageExchangeProfile(profile)).toEqual([]);
    const plan = buildLanguagePracticePlan(profile);
    expect(plan.steps.reduce((sum, step) => sum + step.minutes, 0)).toBe(30);
    expect(plan.steps[1].minutes).toBe(plan.steps[2].minutes);
    expect(languageSource).not.toMatch(
      /MOCK_PARTNERS|Maria García|Yuki Tanaka/
    );
    expect(languageSource).toMatch(/Partner discovery is not connected/);
  });

  it("provides a labeled fixture catalog and bounded local cart", () => {
    expect(commerceSandboxItems).toHaveLength(3);
    expect(
      commerceSandboxItems.every(item => item.sku.startsWith("FIXTURE-"))
    ).toBe(true);
    expect(
      normalizeCommerceSandboxCart({
        "FIXTURE-CREATOR-KIT": 99,
        "NOT-ALLOWED": 4,
      })
    ).toEqual({ "FIXTURE-CREATOR-KIT": 10 });
    expect(commerceSource).toMatch(/Payment unavailable in beta/);
    expect(commerceSource).toMatch(/does not enable[\s\S]*illicit trade/);
  });

  it("restores dating drafts and cleans up local photo URLs", () => {
    expect(datingSource).toMatch(/parseSavedDatingProfile/);
    expect(datingSource).toMatch(/sessionStorage\.getItem/);
    expect(datingSource).toMatch(/URL\.revokeObjectURL/);
    expect(datingSource).toMatch(/18\+ only/);
    expect(datingSource).toMatch(
      /No server[\s\S]*persistence, matching, messaging/
    );
  });

  it("promotes evidenced competitive routes through the shared registry", () => {
    const registryRoutes = new Set(
      evidenceRegistry.routes.map((entry: { route: string }) => entry.route)
    );
    expect(auditSource).toMatch(/beta-route-evidence\.json/);
    for (const route of [
      "/live-streaming",
      "/language-partner-discovery",
      "/dating-profile-setup",
      "/arcade",
    ]) {
      expect(registryRoutes.has(route)).toBe(true);
    }
    expect(arcadeSource).toMatch(/Thirteen local game experiences/);
    expect(arcadeSource).toMatch(/No real-money wagering/);
    expect(gameTests).toMatch(/gap game engineering-beta domain cores/);
  });
});
