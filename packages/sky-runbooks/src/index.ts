export interface RunbookStep {
  id: string;
  instruction: string;
  requiresApproval?: boolean;
}

export interface Runbook {
  id: string;
  steps: readonly RunbookStep[];
}

export interface RunbookPlan {
  runbookId: string;
  stepIds: string[];
  approvalStepIds: string[];
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function planRunbook(runbook: Runbook): RunbookPlan {
  if (!ID.test(runbook.id)) throw new Error("invalid runbook id");
  if (runbook.steps.length === 0) throw new Error("steps required");
  const seen = new Set<string>();
  const stepIds: string[] = [];
  const approvalStepIds: string[] = [];
  for (const step of runbook.steps) {
    if (!ID.test(step.id)) throw new Error("invalid step id");
    if (seen.has(step.id)) throw new Error("duplicate step id");
    if (step.instruction.trim().length === 0 || step.instruction.length > 1_000) {
      throw new Error("invalid instruction");
    }
    seen.add(step.id);
    stepIds.push(step.id);
    if (step.requiresApproval === true) approvalStepIds.push(step.id);
  }
  return { runbookId: runbook.id, stepIds, approvalStepIds };
}
