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
  "client/src/pages/Live.tsx",
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
  const gamingSource = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
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

  it("validates the promoted authenticated WebRTC small-room beta", () => {
    expect(liveSource).toContain("navigator.mediaDevices.getUserMedia");
    expect(liveSource).toContain("new RTCPeerConnection");
    expect(liveSource).toContain(
      "getTracks().forEach(track => track.stop())"
    );
    expect(liveSource).toContain(
      "server coordinates authenticated room/signaling state"
    );
    expect(liveSource).toContain("no server media ingest");
    for (const fakeClaim of ["802K+", "2.4M", "99.9%", "45ms"]) {
      expect(liveSource).not.toContain(fakeClaim);
    }
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
    expect(commerceSandboxItems).toHaveLength(12);
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
    expect(commerceSource).toMatch(/const quote = cartLines\.length/);
    expect(commerceSource).toMatch(/Your quote will appear after you add the first fixture/);
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

  it("keeps dating and social-tip expansion safety gated", () => {
    const datingHome = fs.readFileSync("client/src/pages/DatingHome.tsx", "utf8");
    const social = fs.readFileSync("client/src/pages/ActivityFeed.tsx", "utf8");
    expect(datingHome).toMatch(/I confirm I am 18 or older/);
    expect(datingHome).toMatch(/Block sample/);
    expect(datingHome).toMatch(/Report sample/);
    expect(social).toMatch(/Crypto tip safety rehearsal/);
    expect(social).toMatch(/No value moved/);
    expect(social).toMatch(/tip practice[\s\S]*never creates a transaction or balance/i);
  });

  it("promotes evidenced competitive routes through the shared registry", () => {
    const registryRoutes = new Set(
      evidenceRegistry.routes.map((entry: { route: string }) => entry.route)
    );
    expect(auditSource).toMatch(/beta-route-evidence\.json/);
    for (const route of [
      "/live",
      "/language-partner-discovery",
      "/dating-profile-setup",
      "/arcade",
    ]) {
      expect(registryRoutes.has(route)).toBe(true);
    }
    expect(arcadeSource).toMatch(/Eighteen local game experiences/);
    expect(arcadeSource).toMatch(/Plinko Lab/);
    expect(arcadeSource).toMatch(/No real-money wagering/);
    expect(gameTests).toMatch(/gap game engineering-beta domain cores/);
  });

  it("protects the 50-game catalog discovery and recovery contract", () => {
    expect(gamingSource.match(/\["[^"]+", "[^"]+", "(?:arcade|knowledge|strategy)", "[^"]+"\]/g)).toHaveLength(42);
    expect(arcadeSource.match(/^  \["[^"]+",/gm)).toHaveLength(34);
    expect(gamingSource).toMatch(/50 games visible/);
    expect(gamingSource).toMatch(/Search the 50-game catalog/);
    expect(gamingSource).toMatch(/No games match that search/);
    expect(gamingSource).toMatch(/Show all 50 games/);
    expect(gamingSource).toMatch(/directArcadeModes/);
    expect(gamingSource).toMatch(/skills-\$\{mode\}/);
    expect(gamingSource).toMatch(/Press \/ to search/);
    expect(arcadeSource).toMatch(/SKILL_PROGRESS_KEY/);
    expect(arcadeSource).toMatch(/focusedSkillSlug/);
    expect(arcadeSource).toMatch(/skillCorrect/);
    expect(arcadeSource).toMatch(/Reset progress/);
  });
});
