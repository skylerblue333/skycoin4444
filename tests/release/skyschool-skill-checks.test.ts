import fs from "node:fs";
import { describe, expect, it } from "vitest";

const school = fs.readFileSync("client/src/pages/SkySchool.tsx", "utf8");
const studio = fs.readFileSync(
  "client/src/components/SkillCheckStudio.tsx",
  "utf8",
);
const assessment = fs.readFileSync(
  "client/src/lib/learningAssessment.ts",
  "utf8",
);

describe("SkySchool interactive skill checks", () => {
  it("mounts the skill-check studio in the canonical SkySchool page", () => {
    expect(school).toContain(
      'import SkillCheckStudio from "@/components/SkillCheckStudio";',
    );
    expect(school).toContain("<SkillCheckStudio />");
    expect(school).toContain("Interactive checks");
  });

  it("keeps assessment claims bounded and routes practice into real product areas", () => {
    expect(studio).toContain("practice only");
    expect(studio).toContain("not persisted as credentials");
    expect(studio).toContain("Score this check");
    for (const route of [
      "/hope-a-i",
      "/a-i-code-studio",
      "/trust-safety-dashboard",
      "/beta-web3",
    ]) {
      expect(assessment).toContain(route);
    }
  });

  it("contains twenty authored questions across four learning tracks", () => {
    expect((assessment.match(/question\(/g) ?? []).length).toBe(21);
    for (const track of [
      "ai-literacy",
      "software-engineering",
      "digital-safety",
      "crypto-basics",
    ]) {
      expect(assessment).toContain(track);
    }
  });
});
