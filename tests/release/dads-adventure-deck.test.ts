import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);
const deck = fs.readFileSync(
  "client/src/components/DadsAdventureDeck.tsx",
  "utf8"
);
const index = fs.readFileSync(
  "docs/FAMILY-TIME-CAPSULE-INDEX.md",
  "utf8"
);

describe("Dad's Adventure Deck family Easter egg", () => {
  it("is mounted inside Dad for Later and indexed", () => {
    expect(dadForLater).toMatch(
      /import DadsAdventureDeck from "@\/components\/DadsAdventureDeck"/
    );
    expect(dadForLater).toContain("<DadsAdventureDeck />");
    expect(index).toContain("Dad's Adventure Deck");
    expect(index).toContain("DadsAdventureDeck.tsx");
  });

  it("contains multiple replayable activities", () => {
    expect(deck).toContain("Build a ridiculous story");
    expect(deck).toContain("Ask Dad — prewritten edition");
    expect(deck).toContain("Real-world mission");
    expect(deck).toContain("Dad's very advanced codebreaker");
    expect(deck).toContain("Three-sister constellation relay");
    expect(deck).toContain("Change the place");
    expect(deck).toContain("Deal another mission");
    expect(deck).toContain("Reveal answer");
  });

  it("keeps Ask Dad truthful about being prewritten rather than a live simulation", () => {
    expect(deck).toContain("not AI and not a");
    expect(deck).toMatch(/live\s+conversation/);
    expect(deck).toContain("It is just a box of things I would want");
  });

  it("keeps the sister relay cooperative", () => {
    expect(deck).toContain('const sisterNames = ["Luna", "Summer", "Alexis"]');
    expect(deck).toContain("There is no fastest sister and no best sister");
    expect(deck).toContain("The only win condition is everybody being here");
    expect(deck).toContain("Three different lights, one sky");
  });

  it("contains safe future-facing Dad guidance", () => {
    expect(deck).toContain("You still get a next move");
    expect(deck).toContain("one honest sentence, one phone call");
    expect(deck).toContain("The best version");
    expect(deck).toMatch(/making your own fun\s+together/);
  });

  it("keeps all deck state local and non-persistent", () => {
    expect(deck).toContain("local component state only");
    expect(deck).not.toMatch(/fetch\(/);
    expect(deck).not.toMatch(/trpc\./);
    expect(deck).not.toMatch(/localStorage/);
    expect(deck).not.toMatch(/sessionStorage/);
    expect(deck).not.toMatch(/document\.cookie/);
    expect(deck).not.toMatch(/navigator\./);
  });
});
