import { createHash } from 'node:crypto';

export type WorkflowNode = Readonly<{
  id: string;
  kind: 'input' | 'task' | 'decision' | 'output';
}>;

export type WorkflowEdge = Readonly<{
  from: string;
  to: string;
}>;

export type WorkflowGraph = Readonly<{
  nodes: readonly WorkflowNode[];
  edges: readonly WorkflowEdge[];
  graphId: string;
  executionOrder: readonly string[];
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,128}$/;

export function buildWorkflow(nodes: readonly WorkflowNode[], edges: readonly WorkflowEdge[]): WorkflowGraph {
  if (nodes.length === 0 || nodes.length > 1000) throw new Error('node count must be 1-1000');
  if (edges.length > 5000) throw new Error('edge limit exceeded');
  const byId = new Map<string, WorkflowNode>();
  for (const node of nodes) {
    if (!ID_RE.test(node.id)) throw new Error('invalid node id');
    if (byId.has(node.id)) throw new Error('duplicate node id');
    byId.set(node.id, Object.freeze({ ...node }));
  }
  const adjacency = new Map<string, string[]>();
  const indegree = new Map<string, number>([...byId.keys()].map((id) => [id, 0]));
  const seenEdges = new Set<string>();
  for (const edge of edges) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) throw new Error('edge references unknown node');
    if (edge.from === edge.to) throw new Error('self edge is not allowed');
    const key = `${edge.from}->${edge.to}`;
    if (seenEdges.has(key)) throw new Error('duplicate edge');
    seenEdges.add(key);
    adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), edge.to]);
    indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1);
  }
  const ready = [...indegree.entries()].filter(([, degree]) => degree === 0).map(([id]) => id).sort();
  const order: string[] = [];
  while (ready.length) {
    const id = ready.shift()!;
    order.push(id);
    for (const next of [...(adjacency.get(id) ?? [])].sort()) {
      indegree.set(next, (indegree.get(next) ?? 0) - 1);
      if (indegree.get(next) === 0) {
        ready.push(next);
        ready.sort();
      }
    }
  }
  if (order.length !== nodes.length) throw new Error('workflow contains a cycle');
  const canonical = JSON.stringify({ nodes: [...byId.values()].sort((a, b) => a.id.localeCompare(b.id)), edges: [...edges].sort((a, b) => `${a.from}->${a.to}`.localeCompare(`${b.from}->${b.to}`)) });
  const graphId = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ nodes: Object.freeze([...byId.values()]), edges: Object.freeze([...edges]), graphId, executionOrder: Object.freeze(order) });
}
