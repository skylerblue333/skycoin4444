import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ecosystemAreas } from "../../client/src/lib/ecosystemBeta";

const source = fs.readFileSync("client/src/pages/BetaWorkspace.tsx", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");

describe("unified competitive beta workspace", () => {
  it("is registered and links every headline area", () => {
    expect(app).toMatch(/path="\/beta-workspace" component=\{BetaWorkspace\}/);
    expect(ecosystemAreas).toHaveLength(8);
    for (const area of ecosystemAreas) {
      expect(area.route).toMatch(/^\//);
      expect(area.testGoal.length).toBeGreaterThan(20);
      expect(area.boundary.length).toBeGreaterThan(30);
    }
    expect(source).toMatch(/54 launchable routes/);
    expect(source).toMatch(
      /Social, creator, asset, commerce, language, dating, learning, and gaming/
    );
  });

  it("uses evidence language and keeps high-risk capabilities explicit", () => {
    expect(source).toMatch(/not a claim of traffic, scale, custody/);
    expect(source).toMatch(/Payment processing and financial settlement/);
    expect(source).toMatch(/Wallet custody, signing, transfers/);
    expect(source).toMatch(/Public livestream ingest/);
    expect(source).toMatch(/Unverified people, sellers, products/);
    expect(source).toMatch(/Provider-backed AI actions/);
  });
});
