import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = await readFile(path.join(root, "client/src/App.tsx"), "utf8");
const routePattern = /<Route\s+path="([^"]+)"\s+component=\{([A-Za-z0-9_]+)\}/g;
const labelFor = component => component
  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
  .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
  .replace(/\bA I\b/g, "AI")
  .replace(/\bA P I\b/g, "API")
  .trim();

const byPath = new Map();
for (const match of appSource.matchAll(routePattern)) {
  const [, routePath, component] = match;
  if (routePath.includes(":")) continue;
  if (!byPath.has(routePath)) {
    byPath.set(routePath, { path: routePath, component, label: labelFor(component) });
  }
}

const routes = [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
if (routes.length < 1000) {
  throw new Error(`Route catalog unexpectedly contains only ${routes.length} routes`);
}

await writeFile(
  path.join(root, "client/src/data/routeCatalog.json"),
  `${JSON.stringify({ routes }, null, 2)}\n`,
);
console.log(`Generated ${routes.length} unique static routes.`);
