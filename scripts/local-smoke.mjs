import process from "node:process";

const baseUrl = (
  process.env.BACKEND_BASE_URL ??
  process.env.LOCAL_BASE_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

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
  ["notification preferences", "/notification-preferences"],
  ["activity evidence", "/activity-evidence"],
  ["arcade lab", "/arcade"],
  ["calculator", "/calculator"],
  ["calendar", "/calendar"],
  ["help center", "/help-center"],
  ["accessibility settings", "/accessibility-settings"],
  ["file converter", "/file-converter"],
  ["blog editor", "/blog-editor"],
  ["advanced beta search", "/advanced-search"],
  ["event planner", "/event-planner"],
  ["creator live studio", "/live-streaming"],
  ["language exchange lab", "/language-partner-discovery"],
  ["dating profile setup", "/dating-profile-setup"],
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
  ["privacy settings", "/privacy-settings"],
  ["data export", "/data-export"],
  ["deletion request", "/delete-account"],
  ["onboarding", "/onboarding"],
  ["sign-up flow", "/sign-up-flow"],
];

async function fetchJson(path, label) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { accept: "application/json" },
  });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok)
    throw new Error(
      `${label} failed: ${response.status} ${response.statusText}`
    );
  if (!contentType.includes("application/json")) {
    throw new Error(
      `${label} returned ${contentType || "no content type"}. This usually means LOCAL_BASE_URL points at a Vite-only app shell. Start pnpm dev:local and set BACKEND_BASE_URL to the backend port.`
    );
  }
  return response.json();
}

for (const [label, path] of checks) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok)
    throw new Error(
      `${label} failed: ${response.status} ${response.statusText}`
    );
  console.log(`PASS ${label}: ${response.status}`);
}

const readiness = await fetchJson("/api/beta/readiness", "Readiness");
if (readiness.status !== "ready" || readiness.database !== "ok")
  throw new Error(
    `Readiness failed: status=${readiness.status ?? "unknown"}, database=${readiness.database ?? "unknown"}. Run pnpm local:up && pnpm local:db, then restart pnpm dev:local.`
  );
console.log("PASS readiness: application and database are available");

const health = await fetchJson("/api/beta/health", "Health");
if (
  health.liveFinancialOrChainExecution !== false ||
  readiness.liveFinancialOrChainExecution !== false
)
  throw new Error(
    "Safety gate failed: live financial or chain execution is not explicitly false"
  );
console.log("PASS safety gate: live financial and chain execution disabled");

const publicAuth = await fetchJson("/api/trpc/auth.me", "Auth state");
if (publicAuth?.result?.data?.json !== null)
  throw new Error(
    "Expected signed-out auth.me to return null when local test mode is disabled"
  );
console.log("PASS signed-out auth state");
console.log(`Local smoke test passed for ${baseUrl}`);
