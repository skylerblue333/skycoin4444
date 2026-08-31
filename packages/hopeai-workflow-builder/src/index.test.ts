import { describe, expect, it } from 'vitest';
import { buildWorkflow } from './index';

const nodes = [
  { id: 'input:1', kind: 'input' },
  { id: 'task:1', kind: 'task' },
  { id: 'output:1', kind: 'output' },
] as const;

const edges = [
  { from: 'input:1', to: 'task:1' },
  { from: 'task:1', to: 'output:1' },
] as const;

describe('HopeAI workflow builder', () => {
  it('builds deterministic acyclic execution order', () => {
    const graph = buildWorkflow(nodes, edges);
    expect(graph.executionOrder).toEqual(['input:1', 'task:1', 'output:1']);
    expect(graph.graphId).toBe(buildWorkflow(nodes, edges).graphId);
  });

  it('rejects cycles', () => {
    expect(() => buildWorkflow(nodes, [...edges, { from: 'output:1', to: 'input:1' }])).toThrow('cycle');
  });

  it('rejects unknown edge endpoints', () => {
    expect(() => buildWorkflow(nodes, [{ from: 'input:1', to: 'task:missing' }])).toThrow('unknown node');
  });

  it('rejects duplicate node ids', () => {
    expect(() => buildWorkflow([nodes[0], nodes[0]], [])).toThrow('duplicate node');
  });
});
