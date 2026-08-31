import { createHash } from 'node:crypto';

export type ArtifactRecord = Readonly<{
  name: string;
  version: string;
  sha256: string;
  sizeBytes: number;
  mediaType: string;
}>;

const NAME_RE = /^[a-zA-Z0-9._-]{2,128}$/;
const VERSION_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const SHA_RE = /^[a-f0-9]{64}$/;
const MEDIA_RE = /^[a-z0-9.+-]+\/[a-zA-Z0-9.+-]+$/;

export function createArtifactCatalog(records: readonly ArtifactRecord[]) {
  if (records.length === 0) throw new Error('catalog must contain artifacts');
  if (records.length > 20_000) throw new Error('artifact limit exceeded');
  const seen = new Set<string>();
  const normalized = records.map((record) => {
    if (!NAME_RE.test(record.name)) throw new Error(`invalid artifact name: ${record.name}`);
    if (!VERSION_RE.test(record.version)) throw new Error(`invalid artifact version: ${record.name}`);
    if (!SHA_RE.test(record.sha256)) throw new Error(`invalid artifact sha256: ${record.name}`);
    if (!Number.isSafeInteger(record.sizeBytes) || record.sizeBytes < 0) throw new Error(`invalid artifact size: ${record.name}`);
    if (!MEDIA_RE.test(record.mediaType)) throw new Error(`invalid artifact media type: ${record.name}`);
    const key = `${record.name}@${record.version}`;
    if (seen.has(key)) throw new Error(`duplicate artifact: ${key}`);
    seen.add(key);
    return Object.freeze({ ...record });
  }).sort((a, b) => a.name === b.name ? (a.version < b.version ? -1 : a.version > b.version ? 1 : 0) : a.name < b.name ? -1 : 1);
  const canonical = normalized.map((record) => `${record.name}\0${record.version}\0${record.sha256}\0${record.sizeBytes}\0${record.mediaType}`).join('\n');
  const digest = createHash('sha256').update(`sky.artifact.catalog.v1\n${canonical}`, 'utf8').digest('hex');
  return Object.freeze({ schema: 'sky.artifact.catalog.v1' as const, artifacts: Object.freeze(normalized), digest });
}

export function findArtifact(catalog: ReturnType<typeof createArtifactCatalog>, name: string, version: string) {
  return catalog.artifacts.find((artifact) => artifact.name === name && artifact.version === version);
}
