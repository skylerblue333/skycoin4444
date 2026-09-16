import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { v5Platforms } from "../../client/src/lib/v5Platforms";

const legacySocialSource = fs.readFileSync(
  "client/src/pages/SocialFeedV2.tsx",
  "utf8"
);
const activityFeedSource = fs.readFileSync(
  "client/src/pages/ActivityFeed.tsx",
  "utf8"
);
const gamingSource = fs.readFileSync(
  "client/src/pages/Gaming.tsx",
  "utf8"
);
const arcadeSource = fs.readFileSync(
  "client/src/pages/Arcade.tsx",
  "utf8"
);

describe("V5 social + gaming beta integration", () => {
  it("routes legacy social entry into the persisted social beta", () => {
    expect(legacySocialSource).toMatch(/export \{ default \} from "\.\/ActivityFeed"/);
    expect(activityFeedSource).toMatch(/Persisted records only/);
    expect(activityFeedSource).toMatch(/trpc\.feed\.getFeed/);
    expect(activityFeedSource).toMatch(/trpc\.social\.createPost/);
  });

  it("keeps the Social flagship on the production-shaped activity feed", () => {
    const social = v5Platforms.find(platform => platform.id === "social");
    expect(social?.route).toBe("/activity-feed");
    expect(social?.quickActions.map(action => action.route)).toContain(
      "/social-feed-v2"
    );
  });

  it("keeps Gaming on playable, truth-bounded beta surfaces", () => {
    const gaming = v5Platforms.find(platform => platform.id === "gaming");
    expect(gaming?.route).toBe("/gaming");
    expect(gaming?.quickActions.map(action => action.route)).toContain("/arcade");
    expect(gamingSource).toMatch(/50 games visible/);
    expect(gamingSource).toMatch(/no real-money play/);
    expect(arcadeSource).toMatch(/deterministic domain logic/);
    expect(arcadeSource).toMatch(/No real-money wagering/);
  });
});
