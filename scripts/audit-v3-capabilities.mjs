import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "client/src/data/routeCatalog.json"), "utf8"));
const routes = Array.isArray(catalog.routes) ? catalog.routes : [];
const paths = routes.map(route => route?.path);
const duplicates = paths.filter((route, index) => paths.indexOf(route) !== index);
const invalid = routes.filter(route => !route || typeof route.path !== "string" || !route.path.startsWith("/") || typeof route.label !== "string" || typeof route.component !== "string");

if (routes.length < 1000) throw new Error(`V3 catalog contains only ${routes.length} routes; expected at least 1,000.`);
if (duplicates.length) throw new Error(`V3 catalog contains duplicate paths: ${[...new Set(duplicates)].slice(0, 5).join(", ")}`);
if (invalid.length) throw new Error(`V3 catalog contains ${invalid.length} invalid entries.`);

console.log(`V3 capability audit passed: ${routes.length} unique, labeled, absolute routes.`);
