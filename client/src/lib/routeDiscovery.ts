export type DiscoverableRoute = {
  path: string;
  label: string;
  component: string;
};

function normalized(value: string) {
  return value.toLowerCase().replace(/[-_/]+/g, " ").replace(/\s+/g, " ").trim();
}

function scoreField(field: string, query: string, weights: { exact: number; starts: number; word: number; includes: number }) {
  const value = normalized(field);
  if (!value || !query) return 0;
  if (value === query) return weights.exact;
  if (value.startsWith(query)) return weights.starts;
  if (value.split(" ").some(word => word.startsWith(query))) return weights.word;
  if (value.includes(query)) return weights.includes;
  return 0;
}

export function scoreRoute(route: DiscoverableRoute, rawQuery: string) {
  const query = normalized(rawQuery);
  if (!query) return 0;

  return Math.max(
    scoreField(route.label, query, { exact: 120, starts: 100, word: 82, includes: 65 }),
    scoreField(route.path, query, { exact: 115, starts: 92, word: 76, includes: 58 }),
    scoreField(route.component, query, { exact: 105, starts: 88, word: 72, includes: 54 }),
  );
}

export function searchRoutes(routes: readonly DiscoverableRoute[], rawQuery: string, limit = 12) {
  const query = normalized(rawQuery);
  if (!query) return [];

  return routes
    .map((route, index) => ({ route, index, score: scoreRoute(route, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index || a.route.path.localeCompare(b.route.path))
    .slice(0, Math.max(0, limit))
    .map(item => item.route);
}

export function mergeRecentRoutePaths(current: readonly string[], nextPath: string, limit = 6) {
  return [nextPath, ...current.filter(path => path !== nextPath)].slice(0, Math.max(0, limit));
}

export function resolveRecentRoutes(routes: readonly DiscoverableRoute[], recentPaths: readonly string[], limit = 6) {
  const byPath = new Map(routes.map(route => [route.path, route]));
  return recentPaths
    .map(path => byPath.get(path))
    .filter((route): route is DiscoverableRoute => Boolean(route))
    .slice(0, Math.max(0, limit));
}
