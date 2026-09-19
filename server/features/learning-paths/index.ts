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

function hasPrerequisiteCycle(path: LearningPath): boolean {
  const stepsById = new Map(
    path.steps.filter(step => step.id.trim()).map(step => [step.id, step]),
  );
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
  const errors: string[] = [];
  if (!path.id.trim()) errors.push("id is required");
  if (!path.title.trim()) errors.push("title is required");
  const ids = new Set<string>();

  for (const step of path.steps) {
    if (!step.id.trim()) errors.push("step id is required");
    if (ids.has(step.id)) errors.push(`duplicate step id: ${step.id}`);
    ids.add(step.id);
    if (!step.title.trim()) {
      errors.push(`step title is required: ${step.id || "<empty>"}`);
    }
    if (
      !Number.isSafeInteger(step.estimatedMinutes) ||
      step.estimatedMinutes <= 0
    ) {
      errors.push(
        `estimatedMinutes must be positive: ${step.id || "<empty>"}`,
      );
    }
  }

  for (const step of path.steps) {
    for (const prerequisite of step.prerequisites) {
      if (!ids.has(prerequisite)) {
        errors.push(`unknown prerequisite ${prerequisite} for ${step.id}`);
      }
      if (prerequisite === step.id) {
        errors.push(`step cannot depend on itself: ${step.id}`);
      }
    }
  }

  if (hasPrerequisiteCycle(path)) {
    errors.push("prerequisite graph contains a cycle");
  }
  return errors;
}

export function resolveNextSteps(
  path: LearningPath,
  progress: ProgressSnapshot,
): NextStepResult {
  const completed = new Set(progress.completedStepIds);
  const available: LearningStep[] = [];
  const blocked: Array<{
    stepId: string;
    missingPrerequisites: string[];
  }> = [];

  for (const step of path.steps) {
    if (completed.has(step.id)) continue;
    const missing = step.prerequisites
      .filter(id => !completed.has(id))
      .sort();
    if (missing.length === 0) available.push(step);
    else blocked.push({ stepId: step.id, missingPrerequisites: missing });
  }

  return {
    available: available
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id)),
    blocked: blocked.sort((a, b) => a.stepId.localeCompare(b.stepId)),
  };
}

export function completionPercent(
  path: LearningPath,
  progress: ProgressSnapshot,
): number {
  if (path.steps.length === 0) return 100;
  const validIds = new Set(path.steps.map(step => step.id));
  const completed = new Set(
    progress.completedStepIds.filter(id => validIds.has(id)),
  ).size;
  return Math.round((completed / path.steps.length) * 10000) / 100;
}
