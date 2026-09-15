const DOMAIN_RULES = [
  ["ai", /(^|[^a-z])(ai|agent|agents|model|models|prompt|vector|llm|hope)([^a-z]|$)/i],
  ["identity-security", /(auth|identity|mfa|2fa|permission|security|privacy|trust|audit|session|consent|kyc|compliance|fraud|secret)/i],
  ["commerce", /(shop|marketplace|commerce|checkout|order|catalog|product|cart|coupon|fulfillment|return|invoice|billing|subscription|payment|pricing)/i],
  ["crypto-web3", /(crypto|wallet|token|blockchain|chain|staking|nft|defi|dao|governance|mining|swap|exchange|treasury|ledger|escrow)/i],
  ["social-community", /(social|feed|post|comment|reaction|community|group|profile|message|chat|dating|friend|creator|channel)/i],
  ["media-live", /(stream|live|video|audio|media|camera|reel|story|podcast|broadcast|vod)/i],
  ["education", /(school|course|class|learn|education|quiz|assignment|grade|credential|certificate|tutor|skill|study)/i],
  ["gaming", /(game|gaming|arcade|casino|blackjack|roulette|plinko|crash|tournament|quest|achievement|leaderboard)/i],
  ["enterprise-ops", /(enterprise|admin|crm|project|task|team|organization|workflow|approval|support|job|talent|mentor|inventory)/i],
  ["developer-platform", /(api|developer|sdk|webhook|integration|devops|observability|status|health|config|feature.?flag|queue|cache|storage|backup|recovery|cdn|database)/i],
];

const MARKER_PATTERNS = [
  ["todo", /\bTODO\b/gi],
  ["fixme", /\bFIXME\b/gi],
  ["placeholder", /\bplaceholder\b/gi],
  ["mock", /\bmock(?:ed|ing|s)?\b/gi],
  ["coming-soon", /\bcoming\s+soon\b/gi],
  ["not-implemented", /\bnot\s+implemented\b/gi],
  ["stub", /\bstub(?:bed|s)?\b/gi],
];

export function labelFor(component) {
  return component
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/\bA I\b/g, "AI")
    .replace(/\bA P I\b/g, "API")
    .trim();
}

export function parseStaticRoutes(appSource) {
  const routePattern = /<Route\s+path="([^"]+)"\s+component=\{([A-Za-z0-9_]+)\}/g;
  const byPath = new Map();

  for (const match of appSource.matchAll(routePattern)) {
    const [, routePath, component] = match;
    if (routePath.includes(":")) continue;
    if (!byPath.has(routePath)) {
      byPath.set(routePath, { path: routePath, component, label: labelFor(component) });
    }
  }

  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

export function parseComponentImports(appSource) {
  const imports = new Map();
  const directPattern = /import\s+([A-Za-z_$][\w$]*)\s+from\s+["'](\.\/pages\/[^"']+)["'];?/g;
  const lazyPattern = /const\s+([A-Za-z_$][\w$]*)\s*=\s*lazy\(\(\)\s*=>\s*import\(["'](\.\/pages\/[^"']+)["']\)\);?/g;

  for (const pattern of [directPattern, lazyPattern]) {
    for (const match of appSource.matchAll(pattern)) {
      imports.set(match[1], match[2]);
    }
  }

  return imports;
}

export function classifyDomain(route) {
  const haystack = `${route.path} ${route.label} ${route.component}`.toLowerCase();
  for (const [domain, pattern] of DOMAIN_RULES) {
    if (pattern.test(haystack)) return domain;
  }
  return "general";
}

function countMatches(source, pattern) {
  return [...source.matchAll(new RegExp(pattern.source, pattern.flags))].length;
}

export function inspectSource(source) {
  const lines = source.split(/\r?\n/);
  const nonBlankLines = lines.filter(line => line.trim().length > 0).length;
  const markers = Object.fromEntries(
    MARKER_PATTERNS.map(([name, pattern]) => [name, countMatches(source, pattern)]),
  );
  const markerCount = Object.values(markers).reduce((sum, count) => sum + count, 0);
  const hasInteraction = /\bon(?:Click|Submit|Change|KeyDown|KeyUp|Blur|Focus)=/.test(source);
  const hasState = /\buse(?:State|Reducer|Query|Mutation|Form)\b/.test(source);
  const hasDataCall = /\bfetch\s*\(|\baxios\.|\btrpc\.|\buseQuery\b|\buseMutation\b/.test(source);

  return {
    bytes: Buffer.byteLength(source, "utf8"),
    lines: lines.length,
    nonBlankLines,
    markerCount,
    markers,
    hasInteraction,
    hasState,
    hasDataCall,
  };
}

export function implementationSignal(metrics) {
  if (!metrics) return "unmapped";
  if (metrics.nonBlankLines < 30) return "thin";
  if (metrics.markerCount >= 3 && !metrics.hasInteraction && !metrics.hasDataCall) return "needs-review";
  if (
    metrics.nonBlankLines >= 140 ||
    (metrics.nonBlankLines >= 80 && (metrics.hasInteraction || metrics.hasState || metrics.hasDataCall))
  ) {
    return "substantial";
  }
  return "moderate";
}

export function summarizeCapabilityAudit(routes) {
  const domains = {};
  const implementationSignals = {};
  let sourceMappedCount = 0;
  let markerRouteCount = 0;
  let markerOccurrences = 0;

  for (const route of routes) {
    domains[route.domain] = (domains[route.domain] ?? 0) + 1;
    implementationSignals[route.implementationSignal] =
      (implementationSignals[route.implementationSignal] ?? 0) + 1;
    if (route.source) sourceMappedCount += 1;
    if ((route.metrics?.markerCount ?? 0) > 0) markerRouteCount += 1;
    markerOccurrences += route.metrics?.markerCount ?? 0;
  }

  const routeCount = routes.length;
  return {
    routeCount,
    sourceMappedCount,
    sourceMappedRate: routeCount === 0 ? 0 : Number((sourceMappedCount / routeCount).toFixed(4)),
    markerRouteCount,
    markerOccurrences,
    domains,
    implementationSignals,
  };
}
