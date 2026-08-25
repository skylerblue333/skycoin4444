export interface GradeItem {
  id: string;
  courseId: string;
  title: string;
  maxPoints: number;
}

export interface GradeEntry {
  itemId: string;
  studentId: string;
  points: number;
  recordedAt: number;
}

export interface GradeSummary {
  courseId: string;
  studentId: string;
  earnedPoints: number;
  possiblePoints: number;
  percentageBasisPoints: number | null;
}

export interface GradebookProgressContract extends GradeSummary {
  type: "gradebook.summary";
  occurredAt: number;
}

export interface GradebookServiceOptions {
  now?: () => number;
  onProgress?: (event: GradebookProgressContract) => void;
}

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export class GradebookService {
  private readonly items = new Map<string, GradeItem>();
  private readonly entries = new Map<string, GradeEntry>();
  private readonly now: () => number;
  private readonly onProgress?: (event: GradebookProgressContract) => void;

  constructor(options: GradebookServiceOptions = {}) {
    this.now = options.now ?? Date.now;
    this.onProgress = options.onProgress;
  }

  addItem(input: GradeItem): GradeItem {
    const id = validateId("itemId", input.id);
    const courseId = validateId("courseId", input.courseId);
    const title = input.title.trim();
    if (!title || title.length > 200 || /[\u0000-\u001F\u007F]/.test(title)) {
      throw new Error("invalid_grade_item_title");
    }
    if (
      !Number.isSafeInteger(input.maxPoints) ||
      input.maxPoints <= 0 ||
      input.maxPoints > 1_000_000
    ) {
      throw new Error("invalid_max_points");
    }
    if (this.items.has(id)) throw new Error("grade_item_exists");
    const item = { id, courseId, title, maxPoints: input.maxPoints };
    this.items.set(id, { ...item });
    return { ...item };
  }

  recordScore(input: {
    itemId: string;
    studentId: string;
    points: number;
  }): GradeEntry {
    const item = this.requireItem(input.itemId);
    const studentId = validateId("studentId", input.studentId);
    if (
      !Number.isSafeInteger(input.points) ||
      input.points < 0 ||
      input.points > item.maxPoints
    ) {
      throw new Error("invalid_grade_points");
    }
    const entry: GradeEntry = {
      itemId: item.id,
      studentId,
      points: input.points,
      recordedAt: this.now(),
    };
    this.entries.set(key(item.id, studentId), { ...entry });
    return { ...entry };
  }

  getScore(itemId: string, studentId: string): GradeEntry | undefined {
    const entry = this.entries.get(
      key(validateId("itemId", itemId), validateId("studentId", studentId))
    );
    return entry ? { ...entry } : undefined;
  }

  summarize(courseId: string, studentId: string): GradeSummary {
    const validCourseId = validateId("courseId", courseId);
    const validStudentId = validateId("studentId", studentId);
    const items = [...this.items.values()].filter(
      item => item.courseId === validCourseId
    );
    let earnedPoints = 0;
    let possiblePoints = 0;
    for (const item of items) {
      const entry = this.entries.get(key(item.id, validStudentId));
      if (!entry) continue;
      earnedPoints = safeAdd(earnedPoints, entry.points);
      possiblePoints = safeAdd(possiblePoints, item.maxPoints);
    }
    return {
      courseId: validCourseId,
      studentId: validStudentId,
      earnedPoints,
      possiblePoints,
      percentageBasisPoints:
        possiblePoints === 0
          ? null
          : Math.round((earnedPoints * 10_000) / possiblePoints),
    };
  }

  publishSummary(courseId: string, studentId: string): GradeSummary {
    const summary = this.summarize(courseId, studentId);
    this.onProgress?.({
      type: "gradebook.summary",
      ...summary,
      occurredAt: this.now(),
    });
    return summary;
  }

  private requireItem(itemId: string): GradeItem {
    const item = this.items.get(validateId("itemId", itemId));
    if (!item) throw new Error("grade_item_not_found");
    return { ...item };
  }
}

function key(itemId: string, studentId: string): string {
  return `${itemId}\u0000${studentId}`;
}

function validateId(name: string, value: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) {
    throw new Error(`invalid_${name}`);
  }
  return value;
}

function safeAdd(a: number, b: number): number {
  const value = a + b;
  if (!Number.isSafeInteger(value)) throw new Error("grade_total_overflow");
  return value;
}
