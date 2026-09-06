import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);
const guide = fs.readFileSync(
  "client/src/components/DadsFieldGuide.tsx",
  "utf8"
);

describe("Dad's Field Guide Easter egg", () => {
  it("is mounted inside Dad for Later", () => {
    expect(dadForLater).toMatch(
      /import DadsFieldGuide from "@\/components\/DadsFieldGuide"/
    );
    expect(dadForLater).toContain("<DadsFieldGuide />");
  });

  it("covers the major practical life categories", () => {
    expect(guide).toContain("Your safety comes before being polite");
    expect(guide).toContain("Love should leave room for you to be yourself");
    expect(guide).toContain("Friendship is a real part of a good life");
    expect(guide).toContain("Money is a tool, not your score as a person");
    expect(guide).toContain("Work is part of life, not the whole meaning of it");
    expect(guide).toContain("Your digital life deserves locks too");
    expect(guide).toContain("Take care of the body carrying you through life");
    expect(guide).toContain("A home is mostly the small systems");
    expect(guide).toContain("Cars and travel reward boring preparation");
    expect(guide).toContain("Read before you sign; ask before you assume");
    expect(guide).toContain("If you care for children one day");
    expect(guide).toContain("Keep some joy that does not need to earn anything");
  });

  it("includes relationship, crisis, scam, and family guardrails", () => {
    expect(guide).toContain("A healthy partner can hear no");
    expect(guide).toContain("Consent is ongoing");
    expect(guide).toContain("Never share one-time verification codes");
    expect(guide).toContain("If your mind starts telling you");
    expect(guide).toContain("contact local crisis or emergency services");
    expect(guide).toContain("Do not make a child your therapist");
    expect(guide).toContain("Call your sisters for reasons that are not emergencies");
    expect(guide).toContain("Green flags");
    expect(guide).toContain("Red flags");
  });

  it("includes pause-before-commit checklists", () => {
    expect(guide).toContain("Before you sign something");
    expect(guide).toContain("Before you move in with somebody");
    expect(guide).toContain("Before you marry or make a major commitment");
    expect(guide).toContain("Before you quit a job");
    expect(guide).toContain("Before you post something permanent");
    expect(guide).toContain("Before a big money move");
  });

  it("keeps the guidance future-facing instead of making the children carry Dad", () => {
    expect(guide).toContain("Build a life that belongs to you");
    expect(guide).toContain(
      "I hope being sisters becomes something that gives you more support"
    );
    expect(guide).toContain(
      "if I am lucky enough to be there when you need any of this"
    );
    expect(dadForLater).toContain("What I was trying to build");
    expect(dadForLater).toContain("I wanted more possibilities for your future");
    expect(dadForLater).toContain("I worked very hard on ideas, software, businesses");
    expect(dadForLater).toContain("you could grow up knowing you were loved and had choices");
    expect(dadForLater).toContain("You do not owe SKYCOIN4444");
    expect(dadForLater).toContain("I hope I get to keep showing you that in person");
  });

  it("keeps the guide static and privacy-local", () => {
    expect(guide).toContain("does not save which");
    expect(guide).not.toMatch(/fetch\(/);
    expect(guide).not.toMatch(/trpc\./);
    expect(guide).not.toMatch(/localStorage/);
    expect(guide).not.toMatch(/sessionStorage/);
    expect(guide).not.toMatch(/document\.cookie/);
    expect(guide).not.toMatch(/navigator\./);
  });
});
