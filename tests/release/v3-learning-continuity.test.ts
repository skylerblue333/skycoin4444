import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { gapCourses } from "../../client/src/data/gapCourses";
import {
  getLearningContinuation,
  summarizeLearningPortfolio,
} from "../../client/src/lib/learningContinuity";

const courseCatalog = fs.readFileSync(
  "client/src/pages/CourseCatalog.tsx",
  "utf8"
);
const continuityPanel = fs.readFileSync(
  "client/src/components/LearningContinuityPanel.tsx",
  "utf8"
);
const learningRouter = fs.readFileSync(
  "server/routers/learningProgress.ts",
  "utf8"
);

describe("V3 SkySchool continuity release contract", () => {
  it("keeps account-wide progress behind the protected learning router", () => {
    expect(learningRouter).toMatch(/listAll:\s*protectedProcedure\.query/);
    expect(learningRouter).toMatch(/eq\(courseProgress\.userId, ctx\.user\.id\)/);
    expect(learningRouter).toMatch(/orderBy\(asc\(courseProgress\.courseId\), asc\(courseProgress\.lessonId\)\)/);
  });

  it("connects the course catalog to account-wide continuity", () => {
    expect(courseCatalog).toMatch(/LearningContinuityPanel/);
    expect(courseCatalog).toMatch(/learningProgress\.listAll\.invalidate/);
    expect(courseCatalog).toMatch(/lesson-\$\{selected\.id\}-\$\{lesson\.id\}/);
    expect(continuityPanel).toMatch(/learningProgress\.listAll\.useQuery/);
    expect(continuityPanel).toMatch(/Continue the next unfinished lesson/);
    expect(continuityPanel).toMatch(/Open the next incomplete authored course/);
  });

  it("uses real authored lesson counts for portfolio continuity", () => {
    const first = gapCourses[0];
    expect(first).toBeDefined();
    const records = first.lessons.map(lesson => ({
      courseId: first.id,
      lessonId: lesson.id,
    }));
    const portfolio = summarizeLearningPortfolio(gapCourses, records);
    expect(portfolio.completedCourses).toBe(1);
    expect(portfolio.overallCompletedLessons).toBe(first.lessons.length);
    expect(getLearningContinuation(gapCourses, records, first.id)?.action).toBe("next-course");
  });

  it("preserves truthful education boundaries", () => {
    expect(courseCatalog).toMatch(/does not issue[\s\S]*certificates/);
    expect(continuityPanel).toMatch(/not a credential, grade, or proficiency score/);
    expect(continuityPanel).toMatch(/no accreditation or mastery certification is implied/);
    expect(continuityPanel).toMatch(/no continuation recommendation is inferred/);
  });
});
