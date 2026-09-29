import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("client/src/pages/Charity.tsx", "utf8");
const router = readFileSync("server/routers/charity.ts", "utf8");
const rootRouter = readFileSync("server/routers.ts", "utf8");

describe("SkyHope charity engineering beta", () => {
  it("routes the canonical charity namespace to a real implementation", () => {
    expect(rootRouter).toContain('import { charityRouter } from "./routers/charity"');
    expect(rootRouter).toContain("charity:charityRouter");
    expect(rootRouter).not.toContain('charity:createUnavailableFeatureRouter("Charity")');
  });

  it("provides a non-executing contribution planner and fail-closed legacy donate boundary", () => {
    expect(router).toContain("prepareContribution");
    expect(router).toContain("Live charity donations are not enabled");
    expect(router).toContain("PRECONDITION_FAILED");
  });

  it("removes fabricated live-charity claims from the canonical page", () => {
    expect(page).toContain("Live funds moved");
    expect(page).toContain("Plan created — no money moved");
    expect(page).toContain("No fake donor leaderboard");
    expect(page).not.toContain("100% of donations go directly");
    expect(page).not.toContain("On-chain verified");
    expect(page).not.toContain("WaterAid verified");
    expect(page).not.toContain("1 token = 1 vote");
  });

  it("connects SkyHope to gaming, learning, community, and impact paths", () => {
    expect(page).toContain('href: "/gaming-for-charity"');
    expect(page).toContain('href: "/sky-school"');
    expect(page).toContain('href: "/community"');
    expect(page).toContain('href: "/impact-map"');
  });
});
