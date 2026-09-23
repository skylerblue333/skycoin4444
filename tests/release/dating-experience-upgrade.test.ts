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
const helpers = fs.readFileSync(
  "client/src/lib/datingExperience.ts",
  "utf8",
);

describe("dating experience upgrade", () => {
  it("connects profile setup to discovery instead of ending at a local save", () => {
    expect(profileSetup).toContain('href="/dating-discovery"');
    expect(profileSetup).toContain("Build a profile worth replying to");
    expect(profileSetup).toContain("scoreDatingProfile");
    expect(profileSetup).toContain("browser session");
  });

  it("uses transparent user-provided signals instead of inventing compatibility reasons", () => {
    expect(discovery).toContain("Transparent connection signals");
    expect(discovery).toContain("buildConnectionSignals");
    expect(discovery).toContain("service score");
    expect(helpers).toContain("sharedDatingInterests");
    expect(helpers).not.toMatch(/identity verified|background check passed/i);
  });

  it("provides deterministic conversation starters", () => {
    expect(discovery).toContain("Conversation starters");
    expect(discovery).toContain("buildConversationStarters");
    expect(helpers).toContain("What got you into");
  });

  it("does not display an optimistic dating message before the server accepts it", () => {
    expect(matches).toContain('fetch("/api/dating/messages"');
    expect(matches).toContain("if (!response.ok)");
    expect(matches).toContain('setSendStatus("Message sent.")');
    expect(matches).not.toContain("tempMessage");
    expect(matches).not.toContain("setMessages([...messages, tempMessage])");
  });

  it("keeps adult-only and safety boundaries visible", () => {
    expect(discovery).toContain("18+ discovery only");
    expect(matches).toContain("Adult-only dating beta");
    expect(matches).toContain("Do not send money, crypto, passwords, private keys, or recovery phrases.");
  });
});
