import type { GapCourse } from "@/data/gapCourses";

export type LearningProgressRecord = Readonly<{
  courseId: string;
  lessonId: string;
  completedAt?: string | Date | null;
}>;

export type CourseContinuitySummary = Readonly<{
  courseId: string;
  completedLessonIds: readonly string[];
  completedCount: number;
  lessonCount: number;
  percent: number;
  status: "not-started" | "in-progress" | "complete";
  nextLessonId: string | null;
}>;

export type LearningContinuation = Readonly<{
  selectedCourse: GapCourse;
  selectedSummary: CourseContinuitySummary;
  overallCompletedLessons: number;
  overallLessons: number;
  overallPercent: number;
  completedCourses: number;
  totalCourses: number;
  nextLessonId: string | null;
  nextCourseId: string | null;
  action: "continue-course" | "next-course" | "review-complete";
}>;

function uniqueValidLessonIds(
  course: GapCourse,
  records: readonly LearningProgressRecord[]
) {
  const valid = new Set(course.lessons.map(lesson => lesson.id));
  return Array.from(
    new Set(
      records
        .filter(record => record.courseId === course.id && valid.has(record.lessonId))
        .map(record => record.lessonId)
    )
  );
}

export function summarizeCourseContinuity(
  course: GapCourse,
  records: readonly LearningProgressRecord[]
): CourseContinuitySummary {
  const completedLessonIds = uniqueValidLessonIds(course, records);
  const completed = new Set(completedLessonIds);
  const lessonCount = course.lessons.length;
  const completedCount = completedLessonIds.length;
  const percent = lessonCount
    ? Math.round((completedCount / lessonCount) * 100)
    : 0;
  const nextLessonId =
    course.lessons.find(lesson => !completed.has(lesson.id))?.id ?? null;
  const status =
    completedCount === 0
      ? "not-started"
      : completedCount >= lessonCount
        ? "complete"
        : "in-progress";

  return Object.freeze({
    courseId: course.id,
    completedLessonIds: Object.freeze(completedLessonIds),
    completedCount,
    lessonCount,
    percent,
    status,
    nextLessonId,
  });
}

export function summarizeLearningPortfolio(
  courses: readonly GapCourse[],
  records: readonly LearningProgressRecord[]
) {
  const summaries = courses.map(course =>
    summarizeCourseContinuity(course, records)
  );
  const overallLessons = summaries.reduce(
    (sum, summary) => sum + summary.lessonCount,
    0
  );
  const overallCompletedLessons = summaries.reduce(
    (sum, summary) => sum + summary.completedCount,
    0
  );
  const completedCourses = summaries.filter(
    summary => summary.status === "complete"
  ).length;
  const overallPercent = overallLessons
    ? Math.round((overallCompletedLessons / overallLessons) * 100)
    : 0;

  return Object.freeze({
    summaries: Object.freeze(summaries),
    overallCompletedLessons,
    overallLessons,
    completedCourses,
    totalCourses: courses.length,
    overallPercent,
  });
}

export function getLearningContinuation(
  courses: readonly GapCourse[],
  records: readonly LearningProgressRecord[],
  selectedCourseId: string
): LearningContinuation | null {
  if (!courses.length) return null;
  const selectedIndex = Math.max(
    0,
    courses.findIndex(course => course.id === selectedCourseId)
  );
  const selectedCourse = courses[selectedIndex] ?? courses[0];
  const selectedSummary = summarizeCourseContinuity(selectedCourse, records);
  const portfolio = summarizeLearningPortfolio(courses, records);

  if (selectedSummary.status !== "complete") {
    return Object.freeze({
      selectedCourse,
      selectedSummary,
      overallCompletedLessons: portfolio.overallCompletedLessons,
      overallLessons: portfolio.overallLessons,
      overallPercent: portfolio.overallPercent,
      completedCourses: portfolio.completedCourses,
      totalCourses: portfolio.totalCourses,
      nextLessonId: selectedSummary.nextLessonId,
      nextCourseId: null,
      action: "continue-course",
    });
  }

  const nextCourse = courses
    .slice(selectedIndex + 1)
    .find(course => summarizeCourseContinuity(course, records).status !== "complete");
  const earlierIncomplete = courses
    .slice(0, selectedIndex)
    .find(course => summarizeCourseContinuity(course, records).status !== "complete");
  const nextIncompleteCourse = nextCourse ?? earlierIncomplete ?? null;

  return Object.freeze({
    selectedCourse,
    selectedSummary,
    overallCompletedLessons: portfolio.overallCompletedLessons,
    overallLessons: portfolio.overallLessons,
    overallPercent: portfolio.overallPercent,
    completedCourses: portfolio.completedCourses,
    totalCourses: portfolio.totalCourses,
    nextLessonId: null,
    nextCourseId: nextIncompleteCourse?.id ?? null,
    action: nextIncompleteCourse ? "next-course" : "review-complete",
  });
}

export function getSessionRecallSummary(
  course: GapCourse,
  answers: Readonly<Record<string, number>>
) {
  let answered = 0;
  let correct = 0;
  for (const lesson of course.lessons) {
    const key = `${course.id}:${lesson.id}`;
    const answer = answers[key];
    if (answer === undefined) continue;
    answered += 1;
    if (answer === lesson.question.correctIndex) correct += 1;
  }
  return Object.freeze({ answered, correct, total: course.lessons.length });
}
