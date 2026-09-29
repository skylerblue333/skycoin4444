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
  it("consumes bounded launch prompts and SkyHope mode on workspace load", () => {
    expect(workspace).toMatch(/const launchPrompt = useMemo\(readLaunchPrompt, \[\]\)/);
    expect(workspace).toMatch(/const launchMode = useMemo\(readLaunchMode, \[\]\)/);
    expect(workspace).toMatch(/setInput\(launchPrompt\)/);
    expect(workspace).toMatch(/setMode\(launchMode\)/);
    expect(workspace).toMatch(/option\.id === launchMode/);
    expect(workspace).toMatch(/slice\(0, 4_000\)/);
    expect(workspace).toMatch(/get\("source"\) === "skyhope"/);
  });

  it("keeps the existing SkyHope planner handoffs connected to HopeAI", () => {
    expect(donation).toMatch(/\/hope-a-i\?source=skyhope&prompt=/);
    expect(fundraiser).toMatch(/\/hope-a-i\?source=skyhope&prompt=/);
  });

  it("carries a current Chat draft into HopeAI without claiming remote send", () => {
    expect(messaging).toMatch(/source=messaging&prompt=/);
    expect(messaging).toMatch(/encodeURIComponent\(trimmedDraft\)/);
    expect(messaging).toMatch(/href=\{hopeAIHref\}/);
    expect(messaging).toMatch(/Polish with HopeAI/);
    expect(messaging).toMatch(/No remote message is sent from this screen/);
  });
});
