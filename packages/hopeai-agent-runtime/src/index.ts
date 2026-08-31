import { createHash } from 'node:crypto';

export type AgentStep = Readonly<{
  id: string;
  kind: 'prompt' | 'tool' | 'decision';
  input: string;
  dependsOn?: readonly string[];
}>;

export type AgentPlan = Readonly<{
  agentId: string;
  steps: readonly AgentStep[];
  planId: string;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,128}$/;

export function buildAgentPlan(agentId: string, steps: readonly AgentStep[]): AgentPlan {
  if (!ID_RE.test(agentId)) throw new Error('invalid agent id');
  if (steps.length === 0 || steps.length > 1000) throw new Error('step count must be 1-1000');
  const seen = new Set<string>();
  const completed = new Set<string>();
  const normalized: AgentStep[] = [];
  for (const step of steps) {
    if (!ID_RE.test(step.id)) throw new Error('invalid step id');
    if (seen.has(step.id)) throw new Error('duplicate step id');
    seen.add(step.id);
    if (step.input.length === 0 || step.input.length > 16_000) throw new Error('step input length must be 1-16000');
    const dependencies = [...(step.dependsOn ?? [])];
    if (dependencies.some((dependency) => !completed.has(dependency))) throw new Error('step dependency must reference an earlier step');
    completed.add(step.id);
    normalized.push(Object.freeze({ ...step, dependsOn: Object.freeze(dependencies) }));
  }
  const canonical = JSON.stringify({ agentId, steps: normalized });
  const planId = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ agentId, steps: Object.freeze(normalized), planId });
}

export function nextReadySteps(plan: AgentPlan, completedStepIds: ReadonlySet<string>): readonly AgentStep[] {
  return Object.freeze(plan.steps.filter((step) =>
    !completedStepIds.has(step.id) && (step.dependsOn ?? []).every((dependency) => completedStepIds.has(dependency)),
  ));
}
