import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  classifyDomain,
  implementationSignal,
  inspectSource,
  parseComponentImports,
  parseStaticRoutes,
  summarizeCapabilityAudit,
} from "./lib/route-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "client/src/App.tsx");
const appSource = await readFile(appPath, "utf8");
const imports = parseComponentImports(appSource);
const staticRoutes = parseStaticRoutes(appSource);

async function resolveSource(moduleReference) {
  if (!moduleReference) return null;
  const relativeModule = moduleReference.replace(/^\.\//, "");
  const base = path.join(root, "client/src", relativeModule);
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue until a source candidate resolves.
    }
  }
  return null;
}

const routes = await Promise.all(
  staticRoutes.map(async route => {
    const moduleReference = imports.get(route.component);
    const absoluteSource = await resolveSource(moduleReference);
    const sourceText = absoluteSource ? await readFile(absoluteSource, "utf8") : null;
    const metrics = sourceText === null ? null : inspectSource(sourceText);

    return {
      ...route,
      domain: classifyDomain(route),
      source: absoluteSource ? path.relative(root, absoluteSource).replaceAll(path.sep, "/") : null,
      implementationSignal: implementationSignal(metrics),
      metrics,
    };
  }),
);

const summary = summarizeCapabilityAudit(routes);
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  methodology: {
    purpose: "Repository implementation signals for prioritization; not a production-readiness or feature-completeness certification.",
    sourceMappedRateGate: 0.85,
    minimumStaticRouteGate: 1000,
  },
  summary,
  routes,
};

if (process.argv.includes("--write")) {
  const reportDirectory = path.join(root, "reports");
  await mkdir(reportDirectory, { recursive: true });
  await writeFile(
    path.join(reportDirectory, "v3-capability-quality.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}

console.log("SKYCOIN4444 V3 capability quality audit");
console.log(`Static routes: ${summary.routeCount}`);
console.log(`Source mapped: ${summary.sourceMappedCount} (${(summary.sourceMappedRate * 100).toFixed(1)}%)`);
console.log(`Routes with review markers: ${summary.markerRouteCount}`);
console.log(`Marker occurrences: ${summary.markerOccurrences}`);
console.log(`Implementation signals: ${JSON.stringify(summary.implementationSignals)}`);
console.log(`Domains: ${JSON.stringify(summary.domains)}`);

if (summary.routeCount < 1000) {
  throw new Error(`V3 route portfolio regressed below 1000 static routes: ${summary.routeCount}`);
}
if (summary.sourceMappedRate < 0.85) {
  throw new Error(
    `V3 route-to-source mapping fell below 85%: ${(summary.sourceMappedRate * 100).toFixed(1)}%`,
  );
}
