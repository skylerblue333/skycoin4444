import fs from "node:fs";
import { describe, expect, it } from "vitest";

const home = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const star = fs.readFileSync(
  "client/src/components/KayleeQuietStar.tsx",
  "utf8"
);

describe("Kaylee quiet-star Easter egg", () => {
  it("is mounted separately from the Three Lights family constellation", () => {
    expect(home).toMatch(
      /import KayleeQuietStar from "@\/components\/KayleeQuietStar"/
    );
    expect(home).toContain("<ThreeLightsEasterEgg />");
    expect(home).toContain("<KayleeQuietStar />");
    expect(star).toContain("Not part of the family constellation");
  });

  it("contains the respectful note for Kaylee Alexis Harris", () => {
    expect(star).toContain("A note for Kaylee Alexis Harris");
    expect(star).toContain("Thank you for being part of my story.");
    expect(star).toContain("You were important to me");
    expect(star).toContain("I am grateful for the good memories");
    expect(star).toContain("I am also sorry");
    expect(star).toMatch(/You do not owe me a place\s+in your life/);
    expect(star).toContain("I hope life is kind to you");
    expect(star).toMatch(/if I am around and you ever actually want to say\s+hi/);
  });

  it("does not pressure reconciliation, forgiveness, or caretaking", () => {
    expect(star).toContain("This is not asking you to come back");
    expect(star).toContain("answer me");
    expect(star).toContain("forgive me");
    expect(star).toContain("take care of me");
    expect(star).toMatch(/carry anything for\s+me/);
  });

  it("includes small interactive personal touches", () => {
    expect(star).toContain("One truth");
    expect(star).toContain("One wish");
    expect(star).toContain("One dumb joke");
    expect(star).toContain("Why did the programmer hide a note in the stars?");
    expect(star).toContain("4:44 pocket");
    expect(star).toContain("No prophecy, no secret");
    expect(star).toMatch(/setStarTaps/);
    expect(star).toMatch(/aria-pressed=\{selected === index\}/);
  });

  it("keeps the personal Easter egg local and untracked", () => {
    expect(star).toContain("does not track opens");
    expect(star).not.toMatch(/fetch\(/);
    expect(star).not.toMatch(/trpc\./);
    expect(star).not.toMatch(/localStorage/);
    expect(star).not.toMatch(/sessionStorage/);
    expect(star).not.toMatch(/document\.cookie/);
    expect(star).not.toMatch(/navigator\./);
  });
});
