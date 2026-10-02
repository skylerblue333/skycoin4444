import fs from "node:fs";
import { describe, expect, it } from "vitest";

const messaging = fs.readFileSync(
  "client/src/pages/UnifiedMessaging.tsx",
  "utf8"
);
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);

describe("flagship unified messaging truth boundary", () => {
  it("keeps Chat on the canonical unified messaging route", () => {
    expect(navigation).toMatch(/label: "Chat", route: "\/unified-messaging"/);
    expect(navigation).toMatch(/primaryLinks\.map/);
    expect(navigation).toMatch(/href=\{route\}/);
  });

  it("removes simulated people, replies, and unsupported realtime claims", () => {
    expect(messaging).not.toMatch(/MOCK_CONVERSATIONS/);
    expect(messaging).not.toMatch(/MOCK_MESSAGES/);
    expect(messaging).not.toMatch(/setTimeout\(/);
    expect(messaging).not.toMatch(/Real-time translation/);
    expect(messaging).toMatch(/Transport not connected/);
    expect(messaging).toMatch(/Remote send is intentionally unavailable here/);
  });

  it("provides real local actions and connected ecosystem handoffs", () => {
    expect(messaging).toMatch(/navigator\.clipboard\.writeText/);
    expect(messaging).toMatch(/prepareMessagingHopeAILaunch\(trimmedDraft\)/);
    expect(messaging).toMatch(/consumeHopeAIMessagingReturn\(\)/);
    expect(messaging).toMatch(/navigate\("\/hope-a-i\?source=messaging"\)/);
    expect(messaging).not.toMatch(/source=messaging&prompt=/);
    expect(messaging).toMatch(/href="\/activity-feed"/);
    expect(messaging).toMatch(/No remote message is sent from this screen/);
    expect(messaging).toMatch(/it has not been sent to anyone/);
    expect(messaging).toMatch(/participant-aware messaging/);
  });
});
