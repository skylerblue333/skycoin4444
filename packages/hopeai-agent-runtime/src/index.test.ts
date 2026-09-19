import { describe, expect, it } from 'vitest';
import { buildAgentPlan, nextReadySteps } from './index';

const steps = [
  { id: 'step:1', kind: 'prompt', input: 'Analyze request' },
  {
    id: 'step:2',
    kind: 'decision',
    input: 'Choose action',
    dependsOn: ['step:1'],
  },
] as const;

describe('HopeAI agent runtime', () => {
  it('builds deterministic plans', () => {
    expect(buildAgentPlan('agent:hope', steps).planId).toBe(
      buildAgentPlan('agent:hope', steps).planId,
    );
  });

  it('returns only dependency-ready steps', () => {
    const plan = buildAgentPlan('agent:hope', steps);
    expect(nextReadySteps(plan, new Set()).map((step) => step.id)).toEqual([
      'step:1',
    ]);
    expect(
      nextReadySteps(plan, new Set(['step:1'])).map((step) => step.id),
    ).toEqual(['step:2']);
  });

  it('rejects forward dependencies', () => {
    expect(() =>
      buildAgentPlan('agent:hope', [
        {
          id: 'step:2',
          kind: 'tool',
          input: 'x',
          dependsOn: ['step:1'],
        },
      ]),
    ).toThrow('earlier step');
  });

  it('rejects duplicate step ids', () => {
    expect(() => buildAgentPlan('agent:hope', [steps[0], steps[0]])).toThrow(
      'duplicate step',
    );
  });

  it('fails closed on malformed runtime inputs', () => {
    expect(() =>
      buildAgentPlan(
        'agent:hope',
        null as unknown as Parameters<typeof buildAgentPlan>[1],
      ),
    ).toThrow('steps must be an array');

    expect(() =>
      buildAgentPlan('agent:hope', [
        null as unknown as (typeof steps)[number],
      ]),
    ).toThrow('invalid step at index 0');

    expect(() =>
      buildAgentPlan('agent:hope', [
        {
          id: 'step:1',
          kind: 'remote-shell' as unknown as 'tool',
          input: 'x',
        },
      ]),
    ).toThrow('invalid step kind');

    expect(() =>
      buildAgentPlan('agent:hope', [
        {
          id: 'step:1',
          kind: 'tool',
          input: 42 as unknown as string,
        },
      ]),
    ).toThrow('step input length');

    expect(() =>
      buildAgentPlan('agent:hope', [
        {
          id: 'step:1',
          kind: 'tool',
          input: 'x',
          dependsOn: 'step:0' as unknown as readonly string[],
        },
      ]),
    ).toThrow('step dependencies must be an array');
  });

  it('rejects tampered plans before scheduling work', () => {
    const plan = buildAgentPlan('agent:hope', steps);
    const tampered = { ...plan, planId: '0'.repeat(64) };

    expect(() => nextReadySteps(tampered, new Set())).toThrow(
      'agent plan integrity check failed',
    );
  });

  it('rejects malformed completed-step collections', () => {
    const plan = buildAgentPlan('agent:hope', steps);

    expect(() =>
      nextReadySteps(
        plan,
        null as unknown as ReadonlySet<string>,
      ),
    ).toThrow('completedStepIds must be a set-like iterable');
  });
});
