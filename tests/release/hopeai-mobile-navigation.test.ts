import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const navigation = readFileSync(
  resolve(process.cwd(), "client/src/components/BetaNavigation.tsx"),
  "utf8"
);

describe("HopeAI mobile navigation contract", () => {
  it("keeps HopeAI directly reachable from the persistent mobile dock", () => {
    expect(navigation).toContain('aria-label="Mobile HopeAI"');
    expect(navigation).toContain('href="/hope-a-i"');
    expect(navigation).toContain('<span className="text-[9px] font-bold">HopeAI</span>');
  });

  it("uses the single HopeAI public brand for the impact surface", () => {
    expect(navigation).toContain('{ label: "HopeAI Impact", route: "/charity", icon: HeartHandshake }');
    expect(navigation).not.toContain('{ label: "SkyHope", route: "/charity"');
    expect(navigation).toContain("HopeAI, Impact, Journey");
  });

  it("retains Chat in the expandable primary navigation after the dock promotion", () => {
    expect(navigation).toContain('{ label: "Chat", route: "/unified-messaging", icon: MessageCircleMore }');
  });
});
