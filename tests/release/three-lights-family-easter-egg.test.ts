import fs from "node:fs";
import { describe, expect, it } from "vitest";

const home = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const egg = fs.readFileSync(
  "client/src/components/ThreeLightsEasterEgg.tsx",
  "utf8"
);
const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);

describe("Three Lights family Easter egg", () => {
  it("embeds the three requested family tributes", () => {
    expect(egg).toContain("Luna Avigail");
    expect(egg).toContain("Summer Skye");
    expect(egg).toContain("Alexis Isabella-Jane");
    expect(egg).toContain("Moonlight");
    expect(egg).toContain("Open sky");
    expect(egg).toContain("Starlight");
    expect(egg).toContain("Three lights found.");
  });

  it("keeps Dad's Letter in the Stars intact", () => {
    expect(egg).toContain("Dad's Letter in the Stars");
    expect(egg).toContain("I love you.");
    expect(egg).toContain("I am sorry for the time I missed");
    expect(egg).toContain("I wish I had gotten more time");
    expect(egg).toMatch(/I only\s+wanted to leave love somewhere you could find it\./);
    expect(egg).toContain("I pray that you are safe, deeply loved");
    expect(egg).toContain("Love, Dad");
    expect(egg).toContain("For Luna");
    expect(egg).toContain("For Summer");
    expect(egg).toContain("For Alexis");
    expect(egg).toContain("4:44 wish");
    expect(egg).toContain("Make one wish for yourself. Dad already made three.");
    expect(egg).toContain("Open when you're older");
    expect(egg).toContain("When you doubt yourself");
    expect(egg).toContain("When life gets hard");
    expect(egg).toContain("When life is beautiful");
    expect(egg).toContain("When you think about Dad");
    expect(egg).toContain("You never had to earn my love");
    expect(egg).toContain("You were never responsible for adult problems");
    expect(egg).toContain("I was proud to be");
    expect(egg).toContain("Do not make your lives smaller out of loyalty to me");
    expect(egg).toContain("Dad's 4:44 principles");
    expect(egg).toContain("Ask for help when the weight gets too heavy");
    expect(egg).toContain("Dad's ridiculous coin vault");
    expect(egg).toContain("Four taps, four jokes.");
    expect(egg).toContain("you mined one whole Dad joke");
    expect(egg).toContain("getting all three kids to agree on what to watch");
    expect(egg).toMatch(/onClick=\{recordWishTap\}/);
    expect(egg).toMatch(/aria-expanded=\{coinVaultOpen\}/);
  });

  it("keeps Dad for Later meaningful and future-facing", () => {
    expect(egg).toContain("DadForLater");
    expect(dadForLater).toContain("Dad for Later");
    expect(dadForLater).toContain("Not one goodbye. A bunch of check-ins");
    expect(dadForLater).toContain("When your heart gets broken");
    expect(dadForLater).toContain("When you mess up badly");
    expect(dadForLater).toContain("When you succeed");
    expect(dadForLater).toContain("When you feel alone");
    expect(dadForLater).toContain("When somebody treats you badly");
    expect(dadForLater).toContain("When you have to start over");
    expect(dadForLater).toContain("When you fall in love");
    expect(dadForLater).toContain("When you choose your work");
    expect(dadForLater).toContain("When you become responsible for someone else");
    expect(dadForLater).toContain("When your sisters need you");
    expect(dadForLater).toContain("When you are older than Dad was writing this");
    expect(dadForLater).toContain("On a completely ordinary Tuesday");
    expect(dadForLater).toContain("Questions Dad would ask");
    expect(dadForLater).toContain("Permission slips from Dad");
    expect(dadForLater).toContain("You do not have to become a monument to my life");
    expect(dadForLater).toContain("Build yours.");
  });

  it("keeps Dad for Later private and local", () => {
    expect(dadForLater).toContain("does not");
    expect(dadForLater).not.toMatch(/fetch\(/);
    expect(dadForLater).not.toMatch(/trpc\./);
    expect(dadForLater).not.toMatch(/localStorage/);
    expect(dadForLater).not.toMatch(/sessionStorage/);
    expect(dadForLater).not.toMatch(/document\.cookie/);
    expect(dadForLater).not.toMatch(/navigator\./);
  });

  it("keeps the Easter egg decorative and privacy-local", () => {
    expect(egg).not.toMatch(/fetch\(/);
    expect(egg).not.toMatch(/trpc\./);
    expect(egg).not.toMatch(/localStorage/);
    expect(egg).not.toMatch(/sessionStorage/);
    expect(egg).not.toMatch(/navigator\./);
    expect(egg).not.toMatch(/document\.cookie/);
    expect(egg).not.toMatch(/analytics/i);
    expect(egg).toContain("stores nothing, tracks");
    expect(egg).toContain("does not create an account, profile, or child record");
  });

  it("keeps the constellation keyboard and screen-reader discoverable", () => {
    expect(egg).toMatch(/aria-label="Three Lights family Easter egg"/);
    expect(egg).toMatch(/aria-label="Hidden lights"/);
    expect(egg).toMatch(/aria-pressed=\{isRevealed\}/);
    expect(egg).toMatch(/aria-expanded=\{letterOpen\}/);
    expect(egg).toMatch(/aria-label="Dad's Letter in the Stars"/);
    expect(egg).toMatch(/aria-live="polite"/);
  });

  it("mounts the hidden constellation on the canonical home screen", () => {
    expect(home).toMatch(
      /import ThreeLightsEasterEgg from "@\/components\/ThreeLightsEasterEgg"/
    );
    expect(home).toContain("<ThreeLightsEasterEgg />");
  });
});
