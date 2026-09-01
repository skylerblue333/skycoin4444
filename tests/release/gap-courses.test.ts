import { describe, expect, it } from 'vitest';
import { courseById, gapCourses, gradeCourseQuestion } from '../../client/src/data/gapCourses';

describe('SkySchool gap course content', () => {
  it('authors all nine previously missing course tracks', () => {
    expect(gapCourses).toHaveLength(9);
    expect(new Set(gapCourses.map((course) => course.id)).size).toBe(9);
  });

  it('gives every course meaningful lesson and assessment coverage', () => {
    for (const course of gapCourses) {
      expect(course.lessons.length).toBeGreaterThanOrEqual(5);
      for (const lesson of course.lessons) {
        expect(lesson.title.length).toBeGreaterThan(3);
        expect(lesson.objective.length).toBeGreaterThan(10);
        expect(lesson.summary.length).toBeGreaterThan(40);
        expect(lesson.question.choices.length).toBeGreaterThanOrEqual(2);
        expect(lesson.question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(lesson.question.correctIndex).toBeLessThan(lesson.question.choices.length);
      }
    }
  });

  it('grades assessments deterministically', () => {
    const course = courseById('wallet-security-101');
    expect(course).toBeDefined();
    const question = course!.lessons[0].question;
    expect(gradeCourseQuestion(question, question.correctIndex).correct).toBe(true);
    expect(gradeCourseQuestion(question, (question.correctIndex + 1) % question.choices.length).correct).toBe(false);
  });
});
