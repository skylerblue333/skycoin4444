import { describe, expect, it } from "vitest";
import {
  GradebookService,
  type GradebookProgressContract,
} from "./index";

describe("SkyGradebook domain core", () => {
  it("records bounded scores and summarizes basis-point progress", () => {
    const service = new GradebookService();
    service.addItem({
      id: "quiz_1",
      courseId: "course_1",
      title: "Quiz 1",
      maxPoints: 40,
    });
    service.addItem({
      id: "project_1",
      courseId: "course_1",
      title: "Project",
      maxPoints: 60,
    });
    service.recordScore({ itemId: "quiz_1", studentId: "student_1", points: 30 });
    service.recordScore({
      itemId: "project_1",
      studentId: "student_1",
      points: 60,
    });

    expect(service.summarize("course_1", "student_1")).toEqual({
      courseId: "course_1",
      studentId: "student_1",
      earnedPoints: 90,
      possiblePoints: 100,
      percentageBasisPoints: 9000,
    });
  });

  it("emits a progress integration contract without changing grades", () => {
    let now = 500;
    const events: GradebookProgressContract[] = [];
    const service = new GradebookService({
      now: () => now,
      onProgress: event => events.push(event),
    });
    service.addItem({
      id: "exam_1",
      courseId: "course_2",
      title: "Exam",
      maxPoints: 100,
    });
    service.recordScore({ itemId: "exam_1", studentId: "student_2", points: 88 });
    now = 600;
    service.publishSummary("course_2", "student_2");

    expect(events[0]).toEqual({
      type: "gradebook.summary",
      courseId: "course_2",
      studentId: "student_2",
      earnedPoints: 88,
      possiblePoints: 100,
      percentageBasisPoints: 8800,
      occurredAt: 600,
    });
  });

  it("rejects invalid scores and malformed grade items", () => {
    const service = new GradebookService();
    expect(() =>
      service.addItem({
        id: "bad item",
        courseId: "course_1",
        title: "Quiz",
        maxPoints: 10,
      })
    ).toThrow("invalid_itemId");
    service.addItem({
      id: "quiz_2",
      courseId: "course_1",
      title: "Quiz 2",
      maxPoints: 10,
    });
    expect(() =>
      service.recordScore({ itemId: "quiz_2", studentId: "student_1", points: 11 })
    ).toThrow("invalid_grade_points");
  });

  it("does not count ungraded items in the denominator", () => {
    const service = new GradebookService();
    service.addItem({ id: "a", courseId: "c", title: "A", maxPoints: 10 });
    service.addItem({ id: "b", courseId: "c", title: "B", maxPoints: 10 });
    service.recordScore({ itemId: "a", studentId: "s", points: 5 });
    expect(service.summarize("c", "s").percentageBasisPoints).toBe(5000);
  });
});
