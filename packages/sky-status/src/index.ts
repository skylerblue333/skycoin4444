export const SKY_STATUS_SNAPSHOT = 'sky.status.snapshot.v1' as const;

export type ComponentState = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface ComponentStatus {
  id: string;
  name: string;
  state: ComponentState;
  message?: string;
}

export interface StatusSnapshot {
  type: typeof SKY_STATUS_SNAPSHOT;
  generatedAt: string;
  overall: ComponentState;
  components: readonly ComponentStatus[];
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function canonicalUtc(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) throw new Error('generatedAt must be canonical UTC');
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) throw new Error('generatedAt invalid');
  const expected = value.includes('.') ? value : value.replace('Z', '.000Z');
  if (parsed.toISOString() !== expected) throw new Error('generatedAt must represent a real UTC instant');
  return value;
}

function clean(value: string, max: number, field: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized || normalized.length > max) throw new Error(`${field} invalid`);
  return normalized;
}

const rank: Record<ComponentState, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  outage: 3,
};

export function normalizeComponent(input: ComponentStatus): ComponentStatus {
  if (!ID.test(input.id)) throw new Error('component id invalid');
  return Object.freeze({
    id: input.id,
    name: clean(input.name, 120, 'name'),
    state: input.state,
    ...(input.message === undefined ? {} : { message: clean(input.message, 500, 'message') }),
  });
}

export function createStatusSnapshot(inputs: readonly ComponentStatus[], generatedAt: string): StatusSnapshot {
  if (inputs.length === 0 || inputs.length > 200) throw new Error('components must contain 1-200 entries');
  const components = inputs.map(normalizeComponent);
  const seen = new Set<string>();
  for (const component of components) {
    if (seen.has(component.id)) throw new Error(`duplicate component id ${component.id}`);
    seen.add(component.id);
  }
  const overall = components.reduce<ComponentState>((current, component) =>
    rank[component.state] > rank[current] ? component.state : current, 'operational');
  return Object.freeze({
    type: SKY_STATUS_SNAPSHOT,
    generatedAt: canonicalUtc(generatedAt),
    overall,
    components: Object.freeze([...components]),
  });
}
