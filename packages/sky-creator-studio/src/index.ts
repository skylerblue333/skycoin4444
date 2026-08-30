export type AssetKind = 'text' | 'image-ref' | 'video-ref' | 'audio-ref';
export type StudioAsset = Readonly<{ id: string; kind: AssetKind; title: string; sourceRef: string }>;
export type DraftProject = Readonly<{ id: string; title: string; version: number; status: 'draft' | 'published' | 'archived'; assets: readonly StudioAsset[] }>;

const clean = (value: string, field: string) => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
};

export function createProject(id: string, title: string): DraftProject {
  return Object.freeze({ id: clean(id, 'id'), title: clean(title, 'title'), version: 1, status: 'draft', assets: Object.freeze([]) });
}

export function addAsset(project: DraftProject, asset: StudioAsset): DraftProject {
  if (project.status !== 'draft') throw new Error('only draft projects can be edited');
  if (project.assets.some((item) => item.id === asset.id.trim())) throw new Error('duplicate asset id');
  const normalized = Object.freeze({ id: clean(asset.id, 'asset id'), kind: asset.kind, title: clean(asset.title, 'asset title'), sourceRef: clean(asset.sourceRef, 'sourceRef') });
  return Object.freeze({ ...project, version: project.version + 1, assets: Object.freeze([...project.assets, normalized]) });
}

export function publishProject(project: DraftProject): DraftProject {
  if (project.status !== 'draft') throw new Error('only drafts can be published');
  if (project.assets.length === 0) throw new Error('cannot publish an empty project');
  return Object.freeze({ ...project, version: project.version + 1, status: 'published' });
}

export function archiveProject(project: DraftProject): DraftProject {
  if (project.status === 'archived') return project;
  return Object.freeze({ ...project, version: project.version + 1, status: 'archived' });
}

export const CREATOR_STUDIO_EVENT = 'sky.creator.project.changed.v1' as const;
