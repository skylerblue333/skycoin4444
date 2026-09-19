export interface LearningStep {
  id: string;
  title: string;
  prerequisites: readonly string[];
  estimatedMinutes: number;
}

export interface LearningPath {
  id: string;
  title: string;
  steps: readonly LearningStep[];
}

export interface ProgressSnapshot {
  completedStepIds: readonly string[];
}

export interface NextStepResult {
  available: LearningStep[];
  blocked: Array<{ stepId: string; missingPrerequisites: string[] }>;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasPrerequisiteCycle(path: LearningPath): boolean {
  const stepsById = new Map(path.steps.map(step => [step.id, step]));
  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const stepId of stepsById.keys()) indegree.set(stepId, 0);

  for (const step of stepsById.values()) {
    for (const prerequisite of step.prerequisites) {
      if (!stepsById.has(prerequisite)) continue;
      indegree.set(step.id, (indegree.get(step.id) ?? 0) + 1);
      const next = dependents.get(prerequisite) ?? [];
      next.push(step.id);
      dependents.set(prerequisite, next);
    }
  }

  const queue = [...indegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([stepId]) => stepId);
  let visited = 0;

  for (let index = 0; index < queue.length; index += 1) {
    const stepId = queue[index]!;
    visited += 1;
    for (const dependent of dependents.get(stepId) ?? []) {
      const nextDegree = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, nextDegree);
      if (nextDegree === 0) queue.push(dependent);
    }
  }

  return visited !== stepsById.size;
}

export function validateLearningPath(path: LearningPath): string[] {
  if (!isObjectRecord(path)) return ["learning path is required"];

  const errors: string[] = [];
  if (!isNonBlankString(path.id)) errors.push("id is required");
  if (!isNonBlankString(path.title)) errors.push("title is required");
  if (!Array.isArray(path.steps)) {
    errors.push("steps must be an array");
    return errors;
  }

  const ids = new Set<string>();
  const structurallyValidSteps: LearningStep[] = [];

  for (const [index, step] of path.steps.entries()) {
    if (!isObjectRecord(step)) {
      errors.push(`step is required at index ${index}`);
      continue;
    }

    const stepId = isNonBlankString(step.id) ? step.id : "";
    if (!stepId) {
      errors.push("step id is required");
    } else {
      if (ids.has(stepId)) errors.push(`duplicate step id: ${stepId}`);
      ids.add(stepId);
    }

    if (!isNonBlankString(step.title)) {
      errors.push(`step title is required: ${stepId || "<empty>"}`);
    }

    if (
      !Number.isSafeInteger(step.estimatedMinutes) ||
      (step.estimatedMinutes as number) <= 0
    ) {
      errors.push(
        `estimatedMinutes must be positive: ${stepId || "<empty>"}`,
      );
    }

    if (!Array.isArray(step.prerequisites)) {
      errors.push(
        `prerequisites must be an array: ${stepId || "<empty>"}`,
      );
      continue;
    }
    if (
      step.prerequisites.some(prerequisite => !isNonBlankString(prerequisite))
    ) {
      errors.push(
        `prerequisites must be non-empty strings: ${stepId || "<empty>"}`,
      );
      continue;
    }

    if (
      stepId &&
      isNonBlankString(step.title) &&
      Number.isSafeInteger(step.estimatedMinutes) &&
      (step.estimatedMinutes as number) > 0
    ) {
      structurallyValidSteps.push(step as unknown as LearningStep);
    }
  }

  for (const step of structurallyValidSteps) {
    for (const prerequisite of step.prerequisites) {
      if (!ids.has(prerequisite)) {
        errors.push(`unknown prerequisite ${prerequisite} for ${step.id}`);
      }
      if (prerequisite === step.id) {
        errors.push(`step cannot depend on itself: ${step.id}`);
      }
    }
  }

  if (
    errors.length === 0 &&
    hasPrerequisiteCycle(path as unknown as LearningPath)
  ) {
    errors.push("prerequisite graph contains a cycle");
  }
  return errors;
}

function assertValidLearningPath(path: LearningPath): void {
  const errors = validateLearningPath(path);
  if (errors.length > 0) {
    throw new Error(`invalid learning path: ${errors.join("; ")}`);
  }
}

function completedStepSet(progress: ProgressSnapshot): Set<string> {
  if (!isObjectRecord(progress) || !Array.isArray(progress.completedStepIds)) {
    throw new Error("progress completedStepIds must be an array");
  }
  if (
    progress.completedStepIds.some(stepId => !isNonBlankString(stepId))
  ) {
    throw new Error("progress completedStepIds must contain non-empty strings");
  }
  return new Set(progress.completedStepIds);
}

export function resolveNextSteps(
  path: LearningPath,
  progress: ProgressSnapshot,
): NextStepResult {
  assertValidLearningPath(path);
  const completed = completedStepSet(progress);
  const available: LearningStep[] = [];
  const blocked: Array<{
    stepId: string;
    missingPrerequisites: string[];
  }> = [];

  for (const step of path.steps) {
    if (completed.has(step.id)) continue;
    const missing = step.prerequisites
      .filter(id => !completed.has(id))
      .slice()
      .sort();
    if (missing.length === 0) available.push(step);
    else blocked.push({ stepId: step.id, missingPrerequisites: missing });
  }

  return {
    available: available
      .slice()
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    blocked: blocked.sort((a, b) =>
      a.stepId < b.stepId ? -1 : a.stepId > b.stepId ? 1 : 0,
    ),
  };
}

export function completionPercent(
  path: LearningPath,
  progress: ProgressSnapshot,
): number {
  assertValidLearningPath(path);
  const completed = completedStepSet(progress);
  if (path.steps.length === 0) return 100;

  const validIds = new Set(path.steps.map(step => step.id));
  const completedKnown = [...completed].filter(id => validIds.has(id)).length;
  return Math.round((completedKnown / path.steps.length) * 10000) / 100;
}
