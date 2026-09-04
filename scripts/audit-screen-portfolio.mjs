import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

const evidenceRegistry = JSON.parse(
  await readFile(path.join(process.cwd(), "catalogs/beta-route-evidence.json"), "utf8")
);

const root = process.cwd();
const appSource = await readFile(path.join(root, "client/src/App.tsx"), "utf8");
const routeSource =
  appSource.match(/<Route[\s\S]*?<\/Switch>/)?.[0] ?? appSource;

const lazyPages = new Map();
for (const match of appSource.matchAll(
  /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]\.\/pages\/([^'"]+)['"]\)/g
)) {
  lazyPages.set(match[1], match[2]);
}
const directPages = new Map();
for (const match of appSource.matchAll(
  /import\s+(\w+)\s+from\s+['"]\.\/pages\/([^'"]+)['"]/g
)) {
  directPages.set(match[1], match[2]);
}

const protectedBetaPaths = new Set([
  "/course-catalog",
  "/community-hub",
  "/activity-feed",
  "/profile",
  "/beta-feedback",
]);
const evidenceEntries = Array.isArray(evidenceRegistry.routes)
  ? evidenceRegistry.routes
  : [];
const launchablePaths = new Set(
  evidenceEntries.map(entry => {
    if (
      typeof entry?.route !== "string" ||
      !entry.route.startsWith("/") ||
      typeof entry?.capability !== "string" ||
      entry.capability.trim().length < 10 ||
      typeof entry?.boundary !== "string" ||
      entry.boundary.trim().length < 20 ||
      !Array.isArray(entry?.evidence) ||
      entry.evidence.length === 0
    ) {
      throw new Error(
        `Invalid beta route evidence entry: ${JSON.stringify(entry)}`
      );
    }
    return entry.route;
  })
);
if (launchablePaths.size !== evidenceEntries.length) {
  throw new Error("Duplicate route detected in beta route evidence registry");
}
const controlledPattern =
  /(wallet|custody|checkout|payment|bank|trading|lending|staking|bridge|token|nft|blockchain|validator|yield|swap|ledger|financial|mining|governance|kyc|aml)/i;

function classify(routePath) {
  if (launchablePaths.has(routePath)) return "launchable_beta";
  if (controlledPattern.test(routePath)) return "controlled_or_unavailable";
  return "legacy_unverified";
}

const routes = [];
for (const match of routeSource.matchAll(
  /<Route\s+path="([^"]+)"\s+component=\{(\w+)\}\s*\/>/g
)) {
  const [, routePath, component] = match;
  routes.push({
    path: routePath,
    component,
    page: lazyPages.get(component) ?? directPages.get(component) ?? component,
    readiness: classify(routePath),
    requiresAuth: protectedBetaPaths.has(routePath),
    sourceExists: Boolean(
      lazyPages.get(component) || directPages.get(component)
    ),
  });
}

const routePaths = new Set(routes.map(route => route.path));
const unknownEvidenceRoutes = [...launchablePaths].filter(
  routePath => !routePaths.has(routePath)
);
if (unknownEvidenceRoutes.length > 0) {
  throw new Error(
    `Beta route evidence references unknown routes: ${unknownEvidenceRoutes.join(", ")}`
  );
}

const counts = routes.reduce((acc, route) => {
  acc[route.readiness] = (acc[route.readiness] ?? 0) + 1;
  return acc;
}, {});

const inventory = {
  source: "client/src/App.tsx",
  totalRoutes: routes.length,
  totalLazyPages: lazyPages.size,
  totalDirectPages: directPages.size,
  counts,
  launchableBetaRoutes: routes
    .filter(route => route.readiness === "launchable_beta")
    .map(route => route.path),
  missingSourceRoutes: routes
    .filter(route => !route.sourceExists)
    .map(route => route.path),
  routes,
};

await writeFile(
  path.join(root, "catalogs/screen-inventory.json"),
  `${JSON.stringify(inventory, null, 2)}\n`
);
const markdown = [
  "# Skycoin4444 Screen Portfolio Inventory",
  "",
  "Generated from client/src/App.tsx. This report is an engineering inventory, not a claim that every historical screen is production-ready.",
  "",
  "## Summary",
  "",
  "| Measure | Count |",
  "| --- | ---: |",
  `| Registered routes | ${inventory.totalRoutes} |`,
  `| Lazy page modules | ${inventory.totalLazyPages} |`,
  `| Launchable beta routes | ${counts.launchable_beta ?? 0} |`,
  `| Controlled or unavailable routes | ${counts.controlled_or_unavailable ?? 0} |`,
  `| Legacy unverified routes | ${counts.legacy_unverified ?? 0} |`,
  `| Routes missing a lazy page source | ${inventory.missingSourceRoutes.length} |`,
  "",
  "## Launchable beta routes",
  "",
  ...inventory.launchableBetaRoutes.map(routePath => `- ${routePath}`),
  "",
  "## Safety boundary",
  "",
  "Routes classified as controlled or unavailable must not be promoted merely because a component exists. Financial settlement, custody, signing, production-chain writes, transfers, staking, and provider-backed operations require separate evidence and release approval.",
  "",
].join("\n");
const formattedMarkdown = await prettier.format(`${markdown}\n`, {
  parser: "markdown",
});
await writeFile(
  path.join(root, "docs/release/SCREEN_PORTFOLIO_INVENTORY.md"),
  formattedMarkdown
);

console.log(
  JSON.stringify(
    {
      totalRoutes: inventory.totalRoutes,
      counts,
      missingSourceRoutes: inventory.missingSourceRoutes.length,
    },
    null,
    2
  )
);
