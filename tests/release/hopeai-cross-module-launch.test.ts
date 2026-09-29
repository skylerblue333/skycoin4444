import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workspace = fs.readFileSync(
  "client/src/pages/HopeAIWorkspace.tsx",
  "utf8"
);
const messaging = fs.readFileSync(
  "client/src/pages/UnifiedMessaging.tsx",
  "utf8"
);
const donation = fs.readFileSync(
  "client/src/pages/DonationProcessing.tsx",
  "utf8"
);
const fundraiser = fs.readFileSync(
  "client/src/pages/FundraiserTools.tsx",
  "utf8"
);

describe("HopeAI cross-module launch context", () => {
  it("keeps the merged bounded HopeAI launch-consumer contract", () => {
    expect(workspace).toMatch(/const launchPrompt = readLaunchPrompt\(\)/);
    expect(workspace).toMatch(/setInput\(launchPrompt\)/);
    expect(workspace).toMatch(/get\("source"\) === "skyhope"/);
    expect(workspace).toMatch(/url\.searchParams\.delete\("prompt"\)/);
    expect(workspace).toMatch(/url\.searchParams\.delete\("source"\)/);
    expect(workspace).toMatch(/window\.history\.replaceState/);
    expect(workspace).toMatch(/slice\(0, 4_000\)/);
  });

  it("preserves the existing SkyHope planner handoffs", () => {
    expect(donation).toMatch(/\/hope-a-i\?source=skyhope&prompt=/);
    expect(fundraiser).toMatch(/\/hope-a-i\?source=skyhope&prompt=/);
  });

  it("carries a current Chat draft into the same HopeAI launch contract", () => {
    expect(messaging).toMatch(/source=messaging&prompt=/);
    expect(messaging).toMatch(/encodeURIComponent\(trimmedDraft\)/);
    expect(messaging).toMatch(/href=\{hopeAIHref\}/);
    expect(messaging).toMatch(/Polish with HopeAI/);
    expect(messaging).toMatch(/No remote message is sent from this screen/);
  });
});
