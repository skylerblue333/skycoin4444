import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("unified command-center UI/UX", () => {
  it("keeps the flagship home focused on real routed experiences", () => {
    const source = read("client/src/pages/Home.tsx");

    expect(source).toContain("Make the beta feel like");
    expect(source).toContain("Ten places worth tapping first.");
    expect(source).toContain('href: "/activity-feed"');
    expect(source).toContain('href: "/unified-messaging"');
    expect(source).toContain('href: "/gaming"');
    expect(source).toContain('href: "/live"');
    expect(source).toContain('href: "/sky-school"');
    expect(source).toContain('href: "/hope-a-i"');
    expect(source).toContain('href: "/beta-commerce"');
    expect(source).toContain('href: "/beta-web3"');
    expect(source).toContain('href: "/dating-profile-setup"');
    expect(source).toContain('href: "/language-partner-discovery"');
  });

  it("provides a consistent premium design system instead of page-only styling", () => {
    const css = read("client/src/index.css");
    const cards = read("client/src/components/ui/card.tsx");
    const buttons = read("client/src/components/ui/button.tsx");

    expect(css).toContain(".sky-panel");
    expect(css).toContain(".sky-gold-text");
    expect(css).toContain(".sky-action-glow");
    expect(cards).toContain("border-amber-200/10");
    expect(buttons).toContain("from-amber-300 via-yellow-400 to-orange-400");
  });

  it("keeps core navigation usable on both desktop and mobile", () => {
    const source = read("client/src/components/BetaNavigation.tsx");

    expect(source).toContain('label: "Social"');
    expect(source).toContain('label: "Chat"');
    expect(source).toContain('label: "Gaming"');
    expect(source).toContain('label: "HopeAI"');
    expect(source).toContain('label: "Live"');
    expect(source).toContain('aria-label="Mobile home"');
    expect(source).toContain("Search all SKYCOIN4444 routes");
    expect(source).toContain("Send beta feedback");
  });

  it("keeps the visual rebuild inside the engineering-beta truth boundary", () => {
    const home = read("client/src/pages/Home.tsx");

    expect(home).toContain("No fake account balance");
    expect(home).toContain("Premium presentation, careful claims.");
    expect(home).not.toContain("90% revenue");
    expect(home).not.toContain("official government");
    expect(home).not.toContain("guaranteed APY");
  });
});
