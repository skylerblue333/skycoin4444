import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const discovery = readFileSync("client/src/pages/DatingDiscovery.tsx", "utf8");
const matches = readFileSync("client/src/pages/DatingMatches.tsx", "utf8");
const profile = readFileSync("client/src/pages/DatingProfileSetup.tsx", "utf8");
const premium = readFileSync("client/src/pages/DatingPremium.tsx", "utf8");
const messagesAlias = readFileSync("client/src/pages/DatingMessages.tsx", "utf8");
const profileAlias = readFileSync("client/src/pages/DatingProfile.tsx", "utf8");
const subscriptionAlias = readFileSync("client/src/pages/DatingSubscription.tsx", "utf8");
const appRouter = readFileSync("server/routers.ts", "utf8");
const app = readFileSync("client/src/App.tsx", "utf8");

describe("dating backend integration release contract", () => {
  it("registers the authenticated dating router", () => {
    expect(appRouter).toContain('import { datingRouter } from "./routers/dating"');
    expect(appRouter).toContain("dating:datingRouter");
  });

  it("removes legacy dating REST fetches from the promoted profile/discovery/chat path", () => {
    for (const source of [discovery, matches, profile]) {
      expect(source).not.toContain("/api/dating/");
    }
    expect(discovery).toContain("trpc.dating.discover");
    expect(matches).toContain("trpc.dating.sendMessage");
    expect(profile).toContain("trpc.dating.upsertProfile");
  });

  it("consolidates duplicate dating screens onto the maintained surfaces", () => {
    expect(messagesAlias).toContain('export { default } from "./DatingMatches"');
    expect(profileAlias).toContain('export { default } from "./DatingProfileSetup"');
    expect(subscriptionAlias).toContain('export { default } from "./DatingPremium"');
  });

  it("keeps premium presentation truthful while billing is unavailable", () => {
    expect(premium).toContain("Premium without fake checkout");
    expect(premium).toContain("Billing unavailable in beta");
    expect(premium).not.toContain("Purchasing");
    expect(premium).not.toContain("Upgrading to");
    expect(premium).not.toContain("through Stripe");
  });

  it("routes the safety center", () => {
    expect(app).toContain("DatingSafetyCenter");
    expect(app).toContain('path="/dating-safety"');
  });
});
