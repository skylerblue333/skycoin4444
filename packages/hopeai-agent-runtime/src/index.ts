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
const STEP_KINDS = new Set<AgentStep['kind']>(['prompt', 'tool', 'decision']);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireId(value: unknown, field: string): string {
  if (typeof value !== 'string' || !ID_RE.test(value)) {
    throw new Error(`invalid ${field}`);
  }
  return value;
}

function requireStepKind(value: unknown): AgentStep['kind'] {
  if (typeof value !== 'string' || !STEP_KINDS.has(value as AgentStep['kind'])) {
    throw new Error('invalid step kind');
  }
  return value as AgentStep['kind'];
}

function requireStepInput(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 16_000) {
    throw new Error('step input length must be 1-16000');
  }
  return value;
}

function normalizeDependencies(value: unknown): readonly string[] {
  if (value === undefined) return Object.freeze([]);
  if (!Array.isArray(value)) throw new Error('step dependencies must be an array');

  const dependencies = value.map((dependency) =>
    requireId(dependency, 'step dependency id'),
  );
  if (new Set(dependencies).size !== dependencies.length) {
    throw new Error('duplicate step dependency');
  }
  return Object.freeze(dependencies);
}

function createPlanId(agentId: string, steps: readonly AgentStep[]): string {
  const canonical = JSON.stringify({ agentId, steps });
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export function buildAgentPlan(
  agentId: string,
  steps: readonly AgentStep[],
): AgentPlan {
  const normalizedAgentId = requireId(agentId, 'agent id');
  if (!Array.isArray(steps)) throw new Error('steps must be an array');
  if (steps.length === 0 || steps.length > 1000) {
    throw new Error('step count must be 1-1000');
  }

  const seen = new Set<string>();
  const completed = new Set<string>();
  const normalized: AgentStep[] = [];

  for (const [index, rawStep] of steps.entries()) {
    if (!isObjectRecord(rawStep)) {
      throw new Error(`invalid step at index ${index}`);
    }

    const id = requireId(rawStep.id, 'step id');
    if (seen.has(id)) throw new Error('duplicate step id');
    seen.add(id);

    const kind = requireStepKind(rawStep.kind);
    const input = requireStepInput(rawStep.input);
    const dependencies = normalizeDependencies(rawStep.dependsOn);
    if (dependencies.some((dependency) => !completed.has(dependency))) {
      throw new Error('step dependency must reference an earlier step');
    }

    completed.add(id);
    normalized.push(
      Object.freeze({
        id,
        kind,
        input,
        dependsOn: dependencies,
      }),
    );
  }

  const frozenSteps = Object.freeze(normalized);
  const planId = createPlanId(normalizedAgentId, frozenSteps);
  return Object.freeze({
    agentId: normalizedAgentId,
    steps: frozenSteps,
    planId,
  });
}

function validatePlanIntegrity(plan: AgentPlan): AgentPlan {
  if (!isObjectRecord(plan)) throw new Error('agent plan is required');
  if (!Array.isArray(plan.steps)) throw new Error('agent plan steps must be an array');

  const rebuilt = buildAgentPlan(plan.agentId, plan.steps);
  if (typeof plan.planId !== 'string' || plan.planId !== rebuilt.planId) {
    throw new Error('agent plan integrity check failed');
  }
  return rebuilt;
}

function normalizeCompletedStepIds(
  completedStepIds: ReadonlySet<string>,
): ReadonlySet<string> {
  if (
    completedStepIds === null ||
    typeof completedStepIds !== 'object' ||
    typeof completedStepIds.has !== 'function' ||
    typeof completedStepIds[Symbol.iterator] !== 'function'
  ) {
    throw new Error('completedStepIds must be a set-like iterable');
  }

  const normalized = new Set<string>();
  for (const stepId of completedStepIds) {
    normalized.add(requireId(stepId, 'completed step id'));
  }
  return normalized;
}

export function nextReadySteps(
  plan: AgentPlan,
  completedStepIds: ReadonlySet<string>,
): readonly AgentStep[] {
  const validatedPlan = validatePlanIntegrity(plan);
  const completed = normalizeCompletedStepIds(completedStepIds);
  return Object.freeze(
    validatedPlan.steps.filter(
      (step) =>
        !completed.has(step.id) &&
        (step.dependsOn ?? []).every((dependency) => completed.has(dependency)),
    ),
  );
}
