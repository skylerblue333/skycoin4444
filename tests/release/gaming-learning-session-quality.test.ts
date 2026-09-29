import fs from "node:fs";
import { describe, expect, it } from "vitest";

const arcade = fs.readFileSync("client/src/pages/Arcade.tsx", "utf8");
const quiz = fs.readFileSync("client/src/pages/SkySchoolQuiz.tsx", "utf8");
const state = fs.readFileSync("client/src/lib/betaSessionState.ts", "utf8");
const docs = fs.readFileSync("docs/GAMING_LEARNING_SESSION_QUALITY.md", "utf8");

describe("gaming + learning session quality", () => {
  it("persists bounded browser-local arcade state without implying money", () => {
    expect(arcade).toContain("loadArcadeSession");
    expect(arcade).toContain("saveArcadeSession");
    expect(arcade).toContain("Browser-local session");
    expect(state).toContain("100000");
    expect(state).toContain("ARCADE_SESSION_KEY");
    expect(arcade).toContain("No cash or token value");
  });

  it("turns quiz completion into working beta evidence instead of dead certificate buttons", () => {
    expect(quiz).toContain("appendQuizAttempt");
    expect(quiz).toContain("Copy completion summary");
    expect(quiz).toContain("Continue in SkySchool");
    expect(quiz).toContain("not an accredited certificate");
    expect(quiz).not.toContain("Download Certificate");
    expect(quiz).not.toContain("Share Achievement");
    expect(docs).toContain("browser-local");
    expect(docs).toContain("not an accredited credential");
  });
});
