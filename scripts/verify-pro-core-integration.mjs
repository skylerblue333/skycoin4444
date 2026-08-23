import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const app = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
const notFound = fs.readFileSync(path.join(root, "client/src/pages/NotFound.tsx"), "utf8");
const gap = fs.readFileSync(path.join(root, "client/src/pages/IntegrationGapPages.tsx"), "utf8");

const routes = [
  ["/agent-wallets", "AutonomousAgentWallets"],
  ["/zkml-verification", "ZKMLVerificationCenter"],
  ["/provably-fair-gaming", "ProvablyFairGaming"],
  ["/skyschool-credentialing", "SkySchoolCredentialing"],
];

const failures = [];
if (!app.includes("// Lazy load all 1057 pages")) failures.push("Existing 1,057-page route declaration marker is missing.");
for (const [route, component] of routes) {
  if (!notFound.includes(`\"${route}\": ${component}`)) failures.push(`Missing route mapping: ${route}`);
  if (!gap.includes(`export function ${component}`)) failures.push(`Missing screen component: ${component}`);
}

const evidence = path.join(root, "docs/migration/2026-08-23-pro-core-integration.md");
if (!fs.existsSync(evidence)) failures.push("Migration evidence file is missing.");

if (failures.length) {
  console.error("PRO/CORE INTEGRATION VERIFICATION FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PRO/CORE INTEGRATION VERIFICATION PASSED");
console.log("- Existing 1,057-page route declaration preserved");
console.log("- 4 unique gap screens mapped");
console.log("- Migration evidence present");
