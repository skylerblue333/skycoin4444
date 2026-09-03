import process from "node:process";

const baseUrl = (process.env.LOCAL_BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);
const checks = [
  ["home", "/"],
  ["beta health", "/api/beta/health"],
  ["beta readiness", "/api/beta/readiness"],
  ["beta catalog", "/api/beta/areas"],
  ["mission control", "/mission-control"],
  ["beta workspace", "/beta-workspace"],
  ["creator evidence studio", "/creator-analytics"],
  ["operational readiness", "/operational-readiness"],
  ["discovery center", "/discovery-center"],
  ["beta catalog page", "/beta-catalog"],
  ["beta journey", "/beta-journey"],
  ["course catalog", "/course-catalog"],
  ["beta commerce", "/beta-commerce"],
  ["beta web3", "/beta-web3"],
  ["local AI sandbox", "/a-i-tools-hub"],
  ["beta feedback", "/beta-feedback"],
  ["community hub", "/community-hub"],
  ["activity feed", "/activity-feed"],
  ["profile", "/profile"],
  ["onboarding", "/onboarding"],
  ["sign-up flow", "/sign-up-flow"],
];

for (const [label, path] of checks) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok)
    throw new Error(
      `${label} failed: ${response.status} ${response.statusText}`
    );
  console.log(`PASS ${label}: ${response.status}`);
}

const readinessResponse = await fetch(`${baseUrl}/api/beta/readiness`);
const readiness = await readinessResponse.json();
if (
  !readinessResponse.ok ||
  readiness.status !== "ready" ||
  readiness.database !== "ok"
)
  throw new Error("Readiness failed: database is not available");
console.log("PASS readiness: application and database are available");

const health = await fetch(`${baseUrl}/api/beta/health`).then(response =>
  response.json()
);
if (
  health.liveFinancialOrChainExecution !== false ||
  readiness.liveFinancialOrChainExecution !== false
)
  throw new Error(
    "Safety gate failed: live financial or chain execution is not false"
  );
console.log("PASS safety gate: live financial and chain execution disabled");

const publicAuth = await fetch(`${baseUrl}/api/trpc/auth.me`).then(response =>
  response.json()
);
if (publicAuth?.result?.data?.json !== null)
  throw new Error("Expected signed-out auth.me to return null");
console.log("PASS signed-out auth state");

console.log(`Local smoke test passed for ${baseUrl}`);
