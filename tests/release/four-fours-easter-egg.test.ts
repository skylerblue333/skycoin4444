import fs from "node:fs";
import { describe, expect, it } from "vitest";

const nav = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);

describe("Four Fours global Easter egg", () => {
  it("supports the 44 mark and keyboard unlocks", () => {
    expect(nav).toContain("recordMarkTap");
    expect(nav).toMatch(/onClick=\{recordMarkTap\}/);
    expect(nav).toContain('event.key === "4"');
    expect(nav).toContain("keyRun.current >= 4");
    expect(nav).toContain("setFourFoursOpen(true)");
  });

  it("keeps the Four Fours trail intact", () => {
    expect(nav).toContain("You found the Four Fours.");
    expect(nav).toContain("Build what you can prove");
    expect(nav).toContain("Keep learning");
    expect(nav).toContain("Help somebody");
    expect(nav).toContain("Remember to play");
    expect(nav).toContain(
      "No fake progress. Build it. Test it. Integrate it. Prove it."
    );
  });

  it("keeps the hidden trail non-operational and privacy-local", () => {
    expect(nav).toContain("Unlocks in memory only");
    expect(nav).toContain("No analytics event, cookie, account field");
    expect(nav).not.toMatch(/localStorage/);
    expect(nav).not.toMatch(/sessionStorage/);
    expect(nav).not.toMatch(/document\.cookie/);
    expect(nav).not.toMatch(/fetch\(/);
    expect(nav).not.toMatch(/trpc\./);
  });

  it("does not intercept typing inside editable controls", () => {
    expect(nav).toContain('target?.tagName === "INPUT"');
    expect(nav).toContain('target?.tagName === "TEXTAREA"');
    expect(nav).toContain("target?.isContentEditable");
  });

  it("keeps the overlay dismissible and accessible", () => {
    expect(nav).toMatch(/role="dialog"/);
    expect(nav).toMatch(/aria-modal="true"/);
    expect(nav).toMatch(/aria-labelledby="four-fours-title"/);
    expect(nav).toContain('event.key === "Escape"');
    expect(nav).toMatch(/aria-label="Close Four Fours Easter egg"/);
  });
});
