import { createHash } from 'node:crypto';

export type ReleaseStage = 'engineering-beta' | 'release-candidate' | 'verified-build';

export type ReleaseComponent = Readonly<{
  id: string;
  version: string;
  revision: string;
  stage: ReleaseStage;
  dependencies?: readonly string[];
}>;

export type ReleaseManifest = Readonly<{
  schema: 'sky.release.manifest.v1';
  components: readonly ReleaseComponent[];
  digest: string;
}>;

const ID_RE = /^[a-z][a-z0-9-]{1,63}$/;
const VERSION_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const REVISION_RE = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const STAGES = new Set<ReleaseStage>(['engineering-beta', 'release-candidate', 'verified-build']);

function validateComponent(component: ReleaseComponent): void {
  if (!ID_RE.test(component.id)) throw new Error(`invalid component id: ${component.id}`);
  if (!VERSION_RE.test(component.version)) throw new Error(`invalid component version: ${component.id}`);
  if (!REVISION_RE.test(component.revision)) throw new Error(`invalid immutable revision: ${component.id}`);
  if (!STAGES.has(component.stage)) throw new Error(`invalid release stage: ${component.id}`);
  const dependencies = component.dependencies ?? [];
  if (dependencies.length > 128) throw new Error(`dependency limit exceeded: ${component.id}`);
  const seen = new Set<string>();
  for (const dependency of dependencies) {
    if (!ID_RE.test(dependency)) throw new Error(`invalid dependency id: ${dependency}`);
    if (dependency === component.id) throw new Error(`self dependency: ${component.id}`);
    if (seen.has(dependency)) throw new Error(`duplicate dependency: ${component.id} -> ${dependency}`);
    seen.add(dependency);
  }
}

function canonicalComponent(component: ReleaseComponent): ReleaseComponent {
  return Object.freeze({
    id: component.id,
    version: component.version,
    revision: component.revision,
    stage: component.stage,
    dependencies: Object.freeze([...(component.dependencies ?? [])].sort()),
  });
}

function assertAcyclic(components: readonly ReleaseComponent[]): void {
  const byId = new Map(components.map((component) => [component.id, component]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) throw new Error(`dependency cycle detected at ${id}`);
    visiting.add(id);
    for (const dependency of byId.get(id)?.dependencies ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };

  for (const component of components) visit(component.id);
}

export function createReleaseManifest(input: readonly ReleaseComponent[]): ReleaseManifest {
  if (input.length === 0) throw new Error('manifest must contain at least one component');
  if (input.length > 10_000) throw new Error('component limit exceeded');

  const ids = new Set<string>();
  const canonical = input.map((component) => {
    validateComponent(component);
    if (ids.has(component.id)) throw new Error(`duplicate component id: ${component.id}`);
    ids.add(component.id);
    return canonicalComponent(component);
  });

  for (const component of canonical) {
    for (const dependency of component.dependencies ?? []) {
      if (!ids.has(dependency)) throw new Error(`unknown dependency: ${component.id} -> ${dependency}`);
    }
  }

  const sorted = Object.freeze([...canonical].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)));
  assertAcyclic(sorted);

  const payload = sorted
    .map((component) => [component.id, component.version, component.revision, component.stage, ...(component.dependencies ?? [])].join('\u0000'))
    .join('\n');
  const digest = createHash('sha256').update(`sky.release.manifest.v1\n${payload}`, 'utf8').digest('hex');

  return Object.freeze({ schema: 'sky.release.manifest.v1', components: sorted, digest });
}
