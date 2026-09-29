import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/pages/SchoolDashboard.tsx", "utf8");

describe("truthful SkySchool progress dashboard", () => {
  it("derives learning state from authored courses and the real progress API", () => {
    expect(source).toContain('import { gapCourses } from "@/data/gapCourses"');
    expect(source).toContain("trpc.learningProgress.listAll.useQuery");
    expect(source).toContain("completionKeys");
    expect(source).toContain("Authored courses");
    expect(source).toContain("Lessons completed");
  });

  it("removes fabricated enrollment, XP, certificate, and chain claims", () => {
    expect(source).not.toContain("MY_COURSES");
    expect(source).not.toContain('value: "7"');
    expect(source).not.toContain('value: "43"');
    expect(source).not.toContain('value: "4,820"');
    expect(source).not.toContain("Minted on-chain");
    expect(source).not.toContain("Certificates Earned");
    expect(source).toContain("not an accredited institution");
    expect(source).toContain("does not mint certificates");
  });

  it("connects learning to HopeAI, games, SkyHope and social", () => {
    expect(source).toContain('href: "/hope-a-i"');
    expect(source).toContain('href: "/gaming"');
    expect(source).toContain('href: "/charity"');
    expect(source).toContain('href: "/activity-feed"');
  });
});
