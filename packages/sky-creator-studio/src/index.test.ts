import { describe, expect, it } from 'vitest';
import { addAsset, archiveProject, createProject, publishProject } from './index';

describe('SkyCreatorStudio', () => {
  it('creates normalized drafts', () => {
    expect(createProject(' p1 ', ' Demo ')).toMatchObject({ id: 'p1', title: 'Demo', version: 1, status: 'draft', assets: [] });
  });

  it('adds unique assets and increments version', () => {
    const project = addAsset(createProject('p1', 'Demo'), { id: 'a1', kind: 'text', title: 'Intro', sourceRef: 'inline:intro' });
    expect(project.version).toBe(2);
    expect(project.assets).toHaveLength(1);
    expect(() => addAsset(project, { id: 'a1', kind: 'text', title: 'Again', sourceRef: 'inline:x' })).toThrow('duplicate asset id');
  });

  it('publishes only non-empty drafts', () => {
    expect(() => publishProject(createProject('p1', 'Demo'))).toThrow('cannot publish an empty project');
    const draft = addAsset(createProject('p1', 'Demo'), { id: 'a1', kind: 'image-ref', title: 'Hero', sourceRef: 'asset://hero' });
    const published = publishProject(draft);
    expect(published.status).toBe('published');
    expect(() => addAsset(published, { id: 'a2', kind: 'text', title: 'x', sourceRef: 'inline:x' })).toThrow('only draft projects can be edited');
  });

  it('archives idempotently', () => {
    const archived = archiveProject(createProject('p1', 'Demo'));
    expect(archiveProject(archived)).toBe(archived);
  });
});
