import { describe, expect, it } from "vitest";
import type { GapCourse } from "@/data/gapCourses";
import {
  getLearningContinuation,
  getSessionRecallSummary,
  summarizeCourseContinuity,
  summarizeLearningPortfolio,
} from "./learningContinuity";

const courses: readonly GapCourse[] = [
  {
    id: "course-a",
    title: "Course A",
    level: "beginner",
    lessons: [
      {
        id: "a1",
        title: "A1",
        objective: "Learn A1",
        summary: "A1 summary",
        question: { prompt: "A1?", choices: ["No", "Yes"], correctIndex: 1 },
      },
      {
        id: "a2",
        title: "A2",
        objective: "Learn A2",
        summary: "A2 summary",
        question: { prompt: "A2?", choices: ["Yes", "No"], correctIndex: 0 },
      },
    ],
  },
  {
    id: "course-b",
    title: "Course B",
    level: "intermediate",
    lessons: [
      {
        id: "b1",
        title: "B1",
        objective: "Learn B1",
        summary: "B1 summary",
        question: { prompt: "B1?", choices: ["Yes", "No"], correctIndex: 0 },
      },
    ],
  },
] as const;

describe("learning continuity planner", () => {
  it("ignores unknown and duplicate persisted lesson records", () => {
    const summary = summarizeCourseContinuity(courses[0], [
      { courseId: "course-a", lessonId: "a1" },
      { courseId: "course-a", lessonId: "a1" },
      { courseId: "course-a", lessonId: "unknown" },
      { courseId: "other", lessonId: "a2" },
    ]);
    expect(summary.completedLessonIds).toEqual(["a1"]);
    expect(summary.completedCount).toBe(1);
    expect(summary.percent).toBe(50);
    expect(summary.status).toBe("in-progress");
    expect(summary.nextLessonId).toBe("a2");
  });

  it("summarizes account-wide course and lesson progress", () => {
    const portfolio = summarizeLearningPortfolio(courses, [
      { courseId: "course-a", lessonId: "a1" },
      { courseId: "course-a", lessonId: "a2" },
    ]);
    expect(portfolio.overallCompletedLessons).toBe(2);
    expect(portfolio.overallLessons).toBe(3);
    expect(portfolio.completedCourses).toBe(1);
    expect(portfolio.totalCourses).toBe(2);
    expect(portfolio.overallPercent).toBe(67);
  });

  it("continues the first unfinished lesson in the selected course", () => {
    const continuation = getLearningContinuation(courses, [
      { courseId: "course-a", lessonId: "a1" },
    ], "course-a");
    expect(continuation).toMatchObject({
      action: "continue-course",
      nextLessonId: "a2",
      nextCourseId: null,
    });
  });

  it("moves to the next authored incomplete course after course completion", () => {
    const continuation = getLearningContinuation(courses, [
      { courseId: "course-a", lessonId: "a1" },
      { courseId: "course-a", lessonId: "a2" },
    ], "course-a");
    expect(continuation).toMatchObject({
      action: "next-course",
      nextLessonId: null,
      nextCourseId: "course-b",
    });
  });

  it("returns to an earlier incomplete course when the later selected course is complete", () => {
    const continuation = getLearningContinuation(courses, [
      { courseId: "course-b", lessonId: "b1" },
    ], "course-b");
    expect(continuation).toMatchObject({
      action: "next-course",
      nextCourseId: "course-a",
    });
  });

  it("enters review mode only when every authored lesson is complete", () => {
    const records = [
      { courseId: "course-a", lessonId: "a1" },
      { courseId: "course-a", lessonId: "a2" },
      { courseId: "course-b", lessonId: "b1" },
    ];
    expect(getLearningContinuation(courses, records, "course-b")).toMatchObject({
      action: "review-complete",
      nextLessonId: null,
      nextCourseId: null,
      overallPercent: 100,
      completedCourses: 2,
    });
  });

  it("keeps session recall separate from persisted completion", () => {
    expect(
      getSessionRecallSummary(courses[0], {
        "course-a:a1": 1,
        "course-a:a2": 1,
        "other:thing": 0,
      })
    ).toEqual({ answered: 2, correct: 1, total: 2 });
  });
});
