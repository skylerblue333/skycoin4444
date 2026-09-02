import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const appSource = await readFile(path.join(root, "client/src/App.tsx"), "utf8");
const routeSource =
  appSource.match(/<Route[\s\S]*?<\/Switch>/)?.[0] ?? appSource;

const lazyPages = new Map();
for (const match of appSource.matchAll(
  /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]\.\/pages\/([^'"]+)['"]\)\)/g
)) {
  lazyPages.set(match[1], match[2]);
}

const protectedBetaPaths = new Set([
  "/course-catalog",
  "/community-hub",
  "/activity-feed",
  "/profile",
  "/beta-feedback",
]);
const launchablePaths = new Set([
  "/",
  "/mission-control",
  "/beta-catalog",
  "/beta-journey",
  "/course-catalog",
  "/beta-commerce",
  "/beta-web3",
  "/beta-feedback",
  "/community-hub",
  "/activity-feed",
  "/profile",
  "/onboarding",
  "/sign-up-flow",
]);
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
    page: lazyPages.get(component) ?? component,
    readiness: classify(routePath),
    requiresAuth: protectedBetaPaths.has(routePath),
    sourceExists: Boolean(lazyPages.get(component)),
  });
}

const counts = routes.reduce((acc, route) => {
  acc[route.readiness] = (acc[route.readiness] ?? 0) + 1;
  return acc;
}, {});

const inventory = {
  source: "client/src/App.tsx",
  totalRoutes: routes.length,
  totalLazyPages: lazyPages.size,
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
await writeFile(
  path.join(root, "docs/release/SCREEN_PORTFOLIO_INVENTORY.md"),
  `${markdown}\n`
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
