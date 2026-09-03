import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync("client/src/pages/BetaWorkspace.tsx", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");

describe("unified beta workspace", () => {
  it("is registered and exposes the working journeys", () => {
    expect(app).toMatch(/path="\/beta-workspace" component=\{BetaWorkspace\}/);
    for (const route of ["/course-catalog", "/community-hub", "/activity-feed", "/profile", "/beta-feedback", "/a-i-tools-hub", "/beta-web3", "/creator-analytics"]) {
      expect(source).toContain(`route: "${route}"`);
    }
    expect(source).toMatch(/19 launchable beta routes/);
    expect(source).toMatch(/Creator evidence studio/);
  });

  it("keeps unsupported high-risk capability classes explicit", () => {
    expect(source).toMatch(/Payments and settlement/);
    expect(source).toMatch(/Wallet custody and signing/);
    expect(source).toMatch(/Production chain execution/);
    expect(source).toMatch(/Provider-backed AI actions/);
    expect(source).toMatch(/High-risk actions remain gated/);
  });
});
