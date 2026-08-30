import { describe, expect, it } from 'vitest';
import { archiveArticle, createArticle, publishArticle, reviseArticle, searchKnowledge } from './index';

describe('SkyKnowledge', () => {
  it('creates normalized drafts', () => {
    const article = createArticle({ id: ' a1 ', title: ' Hello ', body: ' Body ', tags: ['Docs', 'Guide'] });
    expect(article).toMatchObject({ id: 'a1', title: 'Hello', body: 'Body', tags: ['docs', 'guide'], status: 'draft', version: 1 });
  });

  it('publishes and searches published articles deterministically', () => {
    const a = publishArticle(createArticle({ id: 'b', title: 'Wallet Guide', body: 'Create a wallet safely', tags: ['wallet'] }));
    const b = publishArticle(createArticle({ id: 'a', title: 'Wallet FAQ', body: 'Common questions', tags: ['faq'] }));
    expect(searchKnowledge([a, b], 'wallet').map((article) => article.id)).toEqual(['a', 'b']);
  });

  it('uses locale-independent code-unit ordering for ids', () => {
    const accented = publishArticle(createArticle({ id: 'ä', title: 'Wallet Intl', body: 'International', tags: ['wallet'] }));
    const ascii = publishArticle(createArticle({ id: 'z', title: 'Wallet ASCII', body: 'ASCII', tags: ['wallet'] }));
    expect(searchKnowledge([accented, ascii], 'wallet').map((article) => article.id)).toEqual(['z', 'ä']);
  });

  it('excludes drafts and archived articles from search', () => {
    const draft = createArticle({ id: 'd', title: 'Wallet Draft', body: 'hidden', tags: [] });
    const archived = archiveArticle(publishArticle(createArticle({ id: 'a', title: 'Wallet Old', body: 'old', tags: [] })));
    expect(searchKnowledge([draft, archived], 'wallet')).toEqual([]);
  });

  it('revisions increment version and return to draft', () => {
    const published = publishArticle(createArticle({ id: 'a', title: 'One', body: 'Body', tags: [] }));
    const revised = reviseArticle(published, { title: 'Two', tags: ['Docs'] });
    expect(revised).toMatchObject({ title: 'Two', tags: ['docs'], status: 'draft', version: 3 });
  });

  it('makes archival terminal and rejects duplicate tags', () => {
    const archived = archiveArticle(createArticle({ id: 'a', title: 'One', body: 'Body', tags: [] }));
    expect(archiveArticle(archived)).toBe(archived);
    expect(() => publishArticle(archived)).toThrow('archived articles cannot be published');
    expect(() => reviseArticle(archived, { title: 'Two' })).toThrow('archived articles cannot be revised');
    expect(() => createArticle({ id: 'a', title: 'One', body: 'Body', tags: ['Docs', ' docs '] })).toThrow('duplicate tag');
  });
});
