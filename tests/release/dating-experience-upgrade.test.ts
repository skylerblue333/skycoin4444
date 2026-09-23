import fs from "node:fs";
import { describe, expect, it } from "vitest";

const profileSetup = fs.readFileSync(
  "client/src/pages/DatingProfileSetup.tsx",
  "utf8",
);
const discovery = fs.readFileSync(
  "client/src/pages/DatingDiscovery.tsx",
  "utf8",
);
const matches = fs.readFileSync(
  "client/src/pages/DatingMatches.tsx",
  "utf8",
);
const home = fs.readFileSync("client/src/pages/DatingHome.tsx", "utf8");
const safety = fs.readFileSync(
  "client/src/pages/DatingSafetyCenter.tsx",
  "utf8",
);
const router = fs.readFileSync("server/routers/dating.ts", "utf8");

describe("dating product suite", () => {
  it("connects profile setup to authenticated persistence and discovery", () => {
    expect(profileSetup).toContain("trpc.dating.upsertProfile");
    expect(profileSetup).toContain('href="/dating-discovery"');
    expect(profileSetup).toContain("sessionStorage.setItem");
    expect(profileSetup).toContain("gender: formData.gender");
  });

  it("uses server-backed discovery and factual overlap instead of fake match scores", () => {
    expect(discovery).toContain("trpc.dating.discover");
    expect(discovery).toContain("sharedSignalCount");
    expect(discovery).toContain("Shared interests");
    expect(discovery).not.toContain("service score");
    expect(discovery).not.toContain("% Match");
    expect(router).toContain("buildDatingConnectionEvidence");
  });

  it("uses mutual-match authorized server messaging", () => {
    expect(matches).toContain("trpc.dating.matches");
    expect(matches).toContain("trpc.dating.conversation");
    expect(matches).toContain("trpc.dating.sendMessage");
    expect(matches).toContain("Mutual matches only");
    expect(router).toContain("requireMatchedConversation");
  });

  it("exposes block report and unmatch controls", () => {
    expect(discovery).toContain("trpc.dating.block");
    expect(discovery).toContain("trpc.dating.report");
    expect(matches).toContain("trpc.dating.unmatch");
    expect(matches).toContain("Block after report");
    expect(router).toContain("datingReports");
    expect(router).toContain("datingBlocks");
  });

  it("keeps a dedicated safety center and explicit product boundaries", () => {
    expect(home).toContain('href="/dating-safety"');
    expect(safety).toContain("Safer choices without fake guarantees");
    expect(safety).toMatch(/not an emergency-response or monitoring\s+service/);
    expect(router).toContain("No identity verification");
  });
});
