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

export function validateLearningPath(path: LearningPath): string[] {
  const errors: string[] = [];
  if (!path.id.trim()) errors.push("id is required");
  if (!path.title.trim()) errors.push("title is required");
  const ids = new Set<string>();
  for (const step of path.steps) {
    if (!step.id.trim()) errors.push("step id is required");
    if (ids.has(step.id)) errors.push(`duplicate step id: ${step.id}`);
    ids.add(step.id);
    if (!step.title.trim()) errors.push(`step title is required: ${step.id || "<empty>"}`);
    if (!Number.isSafeInteger(step.estimatedMinutes) || step.estimatedMinutes <= 0) {
      errors.push(`estimatedMinutes must be positive: ${step.id || "<empty>"}`);
    }
  }
  for (const step of path.steps) {
    for (const prerequisite of step.prerequisites) {
      if (!ids.has(prerequisite)) errors.push(`unknown prerequisite ${prerequisite} for ${step.id}`);
      if (prerequisite === step.id) errors.push(`step cannot depend on itself: ${step.id}`);
    }
  }
  return errors;
}

export function resolveNextSteps(path: LearningPath, progress: ProgressSnapshot): NextStepResult {
  const completed = new Set(progress.completedStepIds);
  const available: LearningStep[] = [];
  const blocked: Array<{ stepId: string; missingPrerequisites: string[] }> = [];

  for (const step of path.steps) {
    if (completed.has(step.id)) continue;
    const missing = step.prerequisites.filter(id => !completed.has(id)).sort();
    if (missing.length === 0) available.push(step);
    else blocked.push({ stepId: step.id, missingPrerequisites: missing });
  }

  return {
    available: available.slice().sort((a, b) => a.id.localeCompare(b.id)),
    blocked: blocked.sort((a, b) => a.stepId.localeCompare(b.stepId)),
  };
}

export function completionPercent(path: LearningPath, progress: ProgressSnapshot): number {
  if (path.steps.length === 0) return 100;
  const validIds = new Set(path.steps.map(step => step.id));
  const completed = new Set(progress.completedStepIds.filter(id => validIds.has(id))).size;
  return Math.round((completed / path.steps.length) * 10000) / 100;
}
