import fs from "node:fs";
import { describe, expect, it } from "vitest";

const messaging = fs.readFileSync(
  "client/src/pages/UnifiedMessaging.tsx",
  "utf8"
);
const workspace = fs.readFileSync(
  "client/src/pages/HopeAIWorkspace.tsx",
  "utf8"
);
const launchContext = fs.readFileSync(
  "client/src/lib/hopeAILaunchContext.ts",
  "utf8"
);

describe("private Messaging and HopeAI draft handoff", () => {
  it("keeps user-authored message content out of the URL", () => {
    expect(messaging).toMatch(/prepareMessagingHopeAILaunch\(trimmedDraft\)/);
    expect(messaging).toMatch(/navigate\("\/hope-a-i\?source=messaging"\)/);
    expect(messaging).not.toMatch(/source=messaging&prompt=/);
    expect(messaging).not.toMatch(/encodeURIComponent\(trimmedDraft\)/);
  });

  it("uses bounded one-time session storage and consumes it in HopeAI", () => {
    expect(launchContext).toMatch(/window\.sessionStorage/);
    expect(launchContext).toMatch(/MAX_HOPEAI_LAUNCH_DRAFT_CHARS = 4_000/);
    expect(launchContext).toMatch(
      /target\.removeItem\(HOPEAI_MESSAGING_DRAFT_KEY\)/
    );
    expect(workspace).toMatch(/params\.get\("source"\) === "messaging"/);
    expect(workspace).toMatch(/consumeMessagingHopeAILaunch\(\)/);
  });

  it("keeps provider execution user initiated and remote messaging fail closed", () => {
    expect(workspace).toMatch(/agentRun\.mutateAsync/);
    expect(messaging).toMatch(/Remote send is intentionally unavailable here/);
    expect(messaging).toMatch(/No remote message is sent from this screen/);
  });

  it("returns selected HopeAI output as a private one-time local draft", () => {
    expect(workspace).toMatch(
      /prepareHopeAIMessagingReturn\(message\.content\)/
    );
    expect(workspace).toMatch(
      /navigate\("\/unified-messaging\?source=hopeai"\)/
    );
    expect(workspace).not.toMatch(/source=hopeai&(?:draft|message|output)=/);
    expect(messaging).toMatch(/consumeHopeAIMessagingReturn\(\)/);
    expect(messaging).toMatch(/it has not been sent to anyone/);
  });

  it("rejects oversized or unavailable reverse handoffs without truncation", () => {
    expect(launchContext).toMatch(
      /normalized\.length > MAX_HOPEAI_LAUNCH_DRAFT_CHARS/
    );
    expect(launchContext).toMatch(/return "too_large"/);
    expect(workspace).toMatch(/nothing is silently truncated/);
    expect(workspace).toMatch(/Use Copy instead/);
  });
});
