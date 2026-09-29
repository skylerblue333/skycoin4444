import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workspace = fs.readFileSync(
  "client/src/pages/HopeAIWorkspace.tsx",
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

describe("HopeAI SkyHope launch-context handoff", () => {
  it("keeps SkyHope planning handoffs connected to the canonical HopeAI route", () => {
    expect(donation).toMatch(/\/hope-a-i\?source=skyhope&prompt=/);
    expect(fundraiser).toMatch(/\/hope-a-i\?source=skyhope&prompt=/);
  });

  it("hydrates the prepared SkyHope prompt and impact mode without auto-sending", () => {
    expect(workspace.match(/readLaunchPrompt/g)?.length ?? 0).toBeGreaterThan(1);
    expect(workspace.match(/readLaunchMode/g)?.length ?? 0).toBeGreaterThan(1);
    expect(workspace).toMatch(/setInput\(launchPrompt\)/);
    expect(workspace).toMatch(/setMode\(option\.id\)/);
    expect(workspace).toMatch(/setSelectedAgentId\(option\.agentId\)/);
    expect(workspace).not.toMatch(/sendMessage\(launchPrompt\)/);
  });

  it("removes consumed launch context from browser history", () => {
    expect(workspace).toMatch(/searchParams\.delete\("prompt"\)/);
    expect(workspace).toMatch(/searchParams\.delete\("source"\)/);
    expect(workspace).toMatch(/history\.replaceState/);
  });
});
