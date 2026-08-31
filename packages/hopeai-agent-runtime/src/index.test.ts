import { describe, expect, it } from 'vitest';
import { buildAgentPlan, nextReadySteps } from './index';

const steps = [
  { id: 'step:1', kind: 'prompt', input: 'Analyze request' },
  { id: 'step:2', kind: 'decision', input: 'Choose action', dependsOn: ['step:1'] },
] as const;

describe('HopeAI agent runtime', () => {
  it('builds deterministic plans', () => {
    expect(buildAgentPlan('agent:hope', steps).planId).toBe(buildAgentPlan('agent:hope', steps).planId);
  });

  it('returns only dependency-ready steps', () => {
    const plan = buildAgentPlan('agent:hope', steps);
    expect(nextReadySteps(plan, new Set()).map((step) => step.id)).toEqual(['step:1']);
    expect(nextReadySteps(plan, new Set(['step:1'])).map((step) => step.id)).toEqual(['step:2']);
  });

  it('rejects forward dependencies', () => {
    expect(() => buildAgentPlan('agent:hope', [{ id: 'step:2', kind: 'tool', input: 'x', dependsOn: ['step:1'] }]))
      .toThrow('earlier step');
  });

  it('rejects duplicate step ids', () => {
    expect(() => buildAgentPlan('agent:hope', [steps[0], steps[0]])).toThrow('duplicate step');
  });
});
