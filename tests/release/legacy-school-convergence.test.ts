import fs from "node:fs";
import { describe, expect, it } from "vitest";

const legacyPages = [
  "client/src/pages/School.tsx",
  "client/src/pages/SchoolDashboard.tsx",
  "client/src/pages/SchoolCourse.tsx",
  "client/src/pages/SchoolLesson.tsx",
  "client/src/pages/SchoolCertificate.tsx",
] as const;

const canonical = fs.readFileSync("client/src/pages/SkySchool.tsx", "utf8");

describe("legacy education route convergence", () => {
  it("routes legacy school pages into the canonical authored SkySchool surface", () => {
    for (const file of legacyPages) {
      const source = fs.readFileSync(file, "utf8");
      expect(source).toMatch(/export \{ default \} from "\.\/SkySchool";/);
      expect(source).not.toMatch(/543K|12\.8M|89K|Minted on-chain|permanently recorded on-chain|SKY444 rewards|money-back guarantee/i);
    }
  });

  it("keeps the canonical school grounded in authored content and beta evidence", () => {
    expect(canonical).toMatch(/gapCourses/);
    expect(canonical).toMatch(/Authored lessons \+ persisted progress/);
    expect(canonical).toMatch(/activityEvidence\.list\.useQuery/);
    expect(canonical).toMatch(/Ask HopeAI Coach/);
    expect(canonical).toMatch(/Practice XP\/Sparks have no cash or token value/);
    expect(canonical).not.toMatch(/543K|12\.8M|89K|Minted on-chain|SKY444 rewards/i);
  });

  it("preserves the real quiz compatibility route instead of deleting assessment functionality", () => {
    const quiz = fs.readFileSync("client/src/pages/SchoolQuiz.tsx", "utf8");
    expect(quiz).toMatch(/quiz/i);
    expect(quiz).not.toMatch(/permanently recorded on-chain|SKY444 rewards/i);
  });
});
