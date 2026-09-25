export type DiscoverableRoute = {
  path: string;
  label: string;
  component: string;
  keywords?: readonly string[];
};

function normalized(value: string) {
  return value.toLowerCase().replace(/[-_/]+/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
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

function routeFields(route: DiscoverableRoute) {
  return [
    { value: route.label, weights: { exact: 120, starts: 100, word: 82, includes: 65 } },
    { value: route.path, weights: { exact: 115, starts: 92, word: 76, includes: 58 } },
    { value: route.component, weights: { exact: 105, starts: 88, word: 72, includes: 54 } },
    ...(route.keywords ?? []).map(value => ({
      value,
      weights: { exact: 96, starts: 80, word: 64, includes: 48 },
    })),
  ];
}

export function scoreRoute(route: DiscoverableRoute, rawQuery: string) {
  const query = normalized(rawQuery);
  if (!query) return 0;

  const fields = routeFields(route);
  const phraseScore = Math.max(...fields.map(field => scoreField(field.value, query, field.weights)));
  const tokens = Array.from(new Set(query.split(" ").filter(Boolean)));

  let tokenScore = 0;
  let matchedTokens = 0;
  for (const token of tokens) {
    const score = Math.max(
      ...fields.map(field =>
        scoreField(field.value, token, {
          exact: Math.round(field.weights.exact * 0.36),
          starts: Math.round(field.weights.starts * 0.34),
          word: Math.round(field.weights.word * 0.32),
          includes: Math.round(field.weights.includes * 0.28),
        }),
      ),
    );
    if (score > 0) {
      matchedTokens += 1;
      tokenScore += score;
    }
  }

  const coverageBonus = tokens.length > 1 && matchedTokens === tokens.length ? 28 : 0;
  return phraseScore + tokenScore + coverageBonus;
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

export function mergeRecentRoutePaths(current: readonly string[], nextPath: string, limit = 12) {
  return [nextPath, ...current.filter(path => path !== nextPath)].slice(0, Math.max(0, limit));
}

export function resolveRecentRoutes(routes: readonly DiscoverableRoute[], recentPaths: readonly string[], limit = 12) {
  const byPath = new Map(routes.map(route => [route.path, route]));
  return recentPaths
    .map(path => byPath.get(path))
    .filter((route): route is DiscoverableRoute => Boolean(route))
    .slice(0, Math.max(0, limit));
}

export function toggleFavoriteRoutePath(current: readonly string[], path: string, limit = 24) {
  if (current.includes(path)) {
    return current.filter(item => item !== path);
  }
  return [path, ...current].slice(0, Math.max(0, limit));
}

export function resolveFavoriteRoutes(routes: readonly DiscoverableRoute[], favoritePaths: readonly string[], limit = 24) {
  const byPath = new Map(routes.map(route => [route.path, route]));
  return favoritePaths
    .map(path => byPath.get(path))
    .filter((route): route is DiscoverableRoute => Boolean(route))
    .slice(0, Math.max(0, limit));
}

export function mergeRouteCollections(collections: readonly (readonly DiscoverableRoute[])[], limit = 12) {
  const merged: DiscoverableRoute[] = [];
  const seen = new Set<string>();

  for (const collection of collections) {
    for (const route of collection) {
      if (seen.has(route.path)) continue;
      seen.add(route.path);
      merged.push(route);
      if (merged.length >= Math.max(0, limit)) return merged;
    }
  }

  return merged;
}
