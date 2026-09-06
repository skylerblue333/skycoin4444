import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);
const toolkit = fs.readFileSync(
  "client/src/components/DadsToolkit.tsx",
  "utf8"
);

describe("Dad's Pocket Toolkit Easter egg", () => {
  it("is mounted inside Dad for Later", () => {
    expect(dadForLater).toMatch(
      /import DadsToolkit from "@\/components\/DadsToolkit"/
    );
    expect(dadForLater).toContain("<DadsToolkit />");
  });

  it("contains practical scripts for hard moments", () => {
    expect(toolkit).toContain("How to apologize");
    expect(toolkit).toContain("How to set a boundary");
    expect(toolkit).toContain("How to ask for help");
    expect(toolkit).toContain("How to have a hard conversation");
    expect(toolkit).toContain("How to make a big decision");
    expect(toolkit).toContain("How to leave an unsafe situation");
    expect(toolkit).toContain("Starting words");
  });

  it("includes decision, self-worth, and bad-day support", () => {
    expect(toolkit).toContain("Before a big decision");
    expect(toolkit).toContain("Things I hope you never believe");
    expect(toolkit).toContain("Tiny reset for a terrible day");
    expect(toolkit).toContain("That you have to be useful to deserve love");
    expect(toolkit).toContain("Tell one safe person");
    expect(toolkit).toContain("Sleep before deciding something permanent");
  });

  it("keeps the toolkit privacy-local", () => {
    expect(toolkit).toContain("stores no");
    expect(toolkit).not.toMatch(/fetch\(/);
    expect(toolkit).not.toMatch(/trpc\./);
    expect(toolkit).not.toMatch(/localStorage/);
    expect(toolkit).not.toMatch(/sessionStorage/);
    expect(toolkit).not.toMatch(/document\.cookie/);
    expect(toolkit).not.toMatch(/navigator\./);
  });
});
