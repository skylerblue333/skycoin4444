import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseStaticRoutes } from "./lib/route-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = await readFile(path.join(root, "client/src/App.tsx"), "utf8");
const routes = parseStaticRoutes(appSource);

if (routes.length < 1000) {
  throw new Error(`Route catalog unexpectedly contains only ${routes.length} routes`);
}

await writeFile(
  path.join(root, "client/src/data/routeCatalog.json"),
  `${JSON.stringify({ routes }, null, 2)}\n`,
);
console.log(`Generated ${routes.length} unique static routes.`);
