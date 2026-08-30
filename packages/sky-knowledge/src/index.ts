export type KnowledgeArticle = Readonly<{
  id: string;
  title: string;
  body: string;
  tags: readonly string[];
  status: 'draft' | 'published' | 'archived';
  version: number;
}>;

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function normalizeTags(tags: readonly string[]): readonly string[] {
  const normalized = tags.map((tag) => clean(tag, 'tag').toLocaleLowerCase('en-US'));
  if (new Set(normalized).size !== normalized.length) throw new Error('duplicate tag');
  return Object.freeze([...normalized].sort());
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function createArticle(input: Omit<KnowledgeArticle, 'status' | 'version'>): KnowledgeArticle {
  return Object.freeze({
    id: clean(input.id, 'id'),
    title: clean(input.title, 'title'),
    body: clean(input.body, 'body'),
    tags: normalizeTags(input.tags),
    status: 'draft',
    version: 1,
  });
}

export function publishArticle(article: KnowledgeArticle): KnowledgeArticle {
  if (article.status === 'archived') throw new Error('archived articles cannot be published');
  if (article.status === 'published') return article;
  return Object.freeze({ ...article, status: 'published', version: article.version + 1 });
}

export function reviseArticle(article: KnowledgeArticle, patch: Partial<Pick<KnowledgeArticle, 'title' | 'body' | 'tags'>>): KnowledgeArticle {
  if (article.status === 'archived') throw new Error('archived articles cannot be revised');
  return Object.freeze({
    ...article,
    title: patch.title === undefined ? article.title : clean(patch.title, 'title'),
    body: patch.body === undefined ? article.body : clean(patch.body, 'body'),
    tags: patch.tags === undefined ? article.tags : normalizeTags(patch.tags),
    status: 'draft',
    version: article.version + 1,
  });
}

export function archiveArticle(article: KnowledgeArticle): KnowledgeArticle {
  if (article.status === 'archived') return article;
  return Object.freeze({ ...article, status: 'archived', version: article.version + 1 });
}

export function searchKnowledge(articles: readonly KnowledgeArticle[], query: string): readonly KnowledgeArticle[] {
  const needle = clean(query, 'query').toLocaleLowerCase('en-US');
  return Object.freeze(
    articles
      .filter((article) => article.status === 'published')
      .filter((article) => `${article.title}\n${article.body}\n${article.tags.join(' ')}`.toLocaleLowerCase('en-US').includes(needle))
      .sort((a, b) => compareCodeUnits(a.id, b.id)),
  );
}

export const KNOWLEDGE_CHANGED_EVENT = 'sky.knowledge.changed.v1' as const;
