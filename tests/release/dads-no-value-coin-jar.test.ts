import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);
const jar = fs.readFileSync(
  "client/src/components/DadsCoinJar.tsx",
  "utf8"
);
const index = fs.readFileSync(
  "docs/FAMILY-TIME-CAPSULE-INDEX.md",
  "utf8"
);

describe("Dad's No-Value Coin Jar family Easter egg", () => {
  it("is mounted inside Dad for Later and indexed", () => {
    expect(dadForLater).toMatch(
      /import DadsCoinJar from "@\/components\/DadsCoinJar"/
    );
    expect(dadForLater).toContain("<DadsCoinJar />");
    expect(index).toContain("Dad's No-Value Coin Jar");
    expect(index).toContain("DadsCoinJar.tsx");
  });

  it("contains the full joke coin collection", () => {
    expect(jar).toContain("Courage Coin");
    expect(jar).toContain("Kindness Coin");
    expect(jar).toContain("Curiosity Coin");
    expect(jar).toContain("Try-Again Coin");
    expect(jar).toContain("Sister Coin");
    expect(jar).toContain("Ordinary-Day Coin");
  });

  it("keeps the coin layer explicitly non-financial", () => {
    expect(jar).toContain("collect exactly zero dollars");
    expect(jar).toContain("not cryptocurrency");
    expect(jar).toContain("anything with financial value");
    expect(jar).toContain("Supply: unlimited");
    expect(jar).toContain("Market cap: nonsense");
    expect(jar).toContain("creates no wallet");
    expect(index).toContain("not cryptocurrency, assets, rewards, inheritance");
  });

  it("contains affectionate practical Dad notes", () => {
    expect(jar).toContain("Courage does not mean you were not scared");
    expect(jar).toContain("stay curious");
    expect(jar).toContain("You are allowed another attempt");
    expect(jar).toContain("Three different people, three different lives");
    expect(jar).toContain("Some days are allowed to just feel nice");
  });

  it("keeps all coin state local and non-persistent", () => {
    expect(jar).toContain("local component state only");
    expect(jar).not.toMatch(/fetch\(/);
    expect(jar).not.toMatch(/trpc\./);
    expect(jar).not.toMatch(/localStorage/);
    expect(jar).not.toMatch(/sessionStorage/);
    expect(jar).not.toMatch(/document\.cookie/);
    expect(jar).not.toMatch(/navigator\./);
  });
});
