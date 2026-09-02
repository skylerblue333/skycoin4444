import process from "node:process";

const baseUrl = (process.env.LOCAL_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const checks = [
  ["home", "/"],
  ["beta health", "/api/beta/health"],
  ["beta catalog", "/api/beta/areas"],
];

for (const [label, path] of checks) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(`${label} failed: ${response.status} ${response.statusText}`);
  console.log(`PASS ${label}: ${response.status}`);
}

const health = await fetch(`${baseUrl}/api/beta/health`).then((response) => response.json());
if (health.liveFinancialOrChainExecution !== false) throw new Error("Safety gate failed: live financial or chain execution is not false");
console.log("PASS safety gate: live financial and chain execution disabled");

const publicAuth = await fetch(`${baseUrl}/api/trpc/auth.me`).then((response) => response.json());
if (publicAuth?.result?.data?.json !== null) throw new Error("Expected signed-out auth.me to return null");
console.log("PASS signed-out auth state");

console.log(`Local smoke test passed for ${baseUrl}`);
