import process from "node:process";

const INCIDENT_TITLE = "[ops] Hosted beta health monitor incident";
const API_VERSION = "2022-11-28";
const ISSUE_PAGE_SIZE = 100;
const MAX_ISSUE_PAGES = 20;

function required(name) {
  const value = (process.env[name] ?? "").trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function validateRepository(repository) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error("GITHUB_REPOSITORY must be in owner/name form");
  }
}

function encodeRepository(repository) {
  return repository
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

function apiOrigin() {
  const raw = (process.env.GITHUB_API_URL ?? "https://api.github.com").trim();
  const url = new URL(raw);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("GITHUB_API_URL must be an HTTP(S) origin without credentials");
  }
  return url.origin;
}

function runUrl(repository, runId) {
  const server = (process.env.GITHUB_SERVER_URL ?? "https://github.com")
    .trim()
    .replace(/\/$/, "");
  return `${server}/${repository}/actions/runs/${runId}`;
}

async function githubRequest(path, token, init = {}) {
  const response = await fetch(apiOrigin() + path, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": API_VERSION,
      "user-agent": "skycoin4444-hosted-beta-monitor",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API ${init.method ?? "GET"} ${path} returned HTTP ${response.status}`
    );
  }
  if (response.status === 204) return null;
  return response.json();
}

function matchingIncident(issues) {
  return (
    issues.find(
      issue =>
        issue &&
        typeof issue === "object" &&
        issue.title === INCIDENT_TITLE &&
        !issue.pull_request &&
        Number.isSafeInteger(issue.number)
    ) ?? null
  );
}

async function findOpenIncident(repository, token) {
  const encodedRepo = encodeRepository(repository);

  for (let page = 1; page <= MAX_ISSUE_PAGES; page += 1) {
    const result = await githubRequest(
      `/repos/${encodedRepo}/issues?state=open&per_page=${ISSUE_PAGE_SIZE}&page=${page}`,
      token
    );
    if (!Array.isArray(result)) {
      throw new Error("GitHub open-issues response was not an array");
    }

    const incident = matchingIncident(result);
    if (incident) return incident;
    if (result.length < ISSUE_PAGE_SIZE) return null;
  }

  throw new Error(
    `Open-issue scan exceeded ${MAX_ISSUE_PAGES * ISSUE_PAGE_SIZE} items`
  );
}

function incidentBody(repository, runId, sha, result) {
  return [
    "Automated engineering-beta monitor incident.",
    "",
    `- Monitor result: **${result}**`,
    `- Expected source SHA: \`${sha}\``,
    `- Workflow run: ${runUrl(repository, runId)}`,
    "",
    "The scheduled/manual hosted-beta monitor failed its public health, readiness, authentication-configuration, safety-boundary, or exact-release check.",
    "",
    "This issue intentionally contains no invitation credentials, session tokens, provider secrets, or request bodies. Investigate the linked workflow and hosted deployment before calling the beta current.",
  ].join("\n");
}

function recoveryComment(repository, runId, sha) {
  return [
    "Automated recovery observed.",
    "",
    `- Healthy source SHA: \`${sha}\``,
    `- Workflow run: ${runUrl(repository, runId)}`,
    "",
    "The hosted-beta monitor returned to success, so this incident is being closed automatically.",
  ].join("\n");
}

async function main() {
  const token = required("GITHUB_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  validateRepository(repository);

  const monitorResult = required("HOSTED_BETA_MONITOR_RESULT").toLowerCase();
  const runId = required("GITHUB_RUN_ID");
  const sha = required("GITHUB_SHA");
  if (!/^[0-9a-f]{40}$/i.test(sha)) {
    throw new Error("GITHUB_SHA must be a full 40-character Git commit SHA");
  }

  if (monitorResult === "cancelled" || monitorResult === "skipped") {
    console.log(
      `Hosted beta monitor result ${monitorResult}; incident state left unchanged`
    );
    return;
  }
  if (monitorResult !== "success" && monitorResult !== "failure") {
    throw new Error(
      "HOSTED_BETA_MONITOR_RESULT must be success, failure, cancelled, or skipped"
    );
  }

  const incident = await findOpenIncident(repository, token);
  const encodedRepo = encodeRepository(repository);

  if (monitorResult === "failure") {
    if (incident) {
      console.log(
        `Hosted beta incident already open as #${incident.number}; no duplicate created`
      );
      return;
    }

    const created = await githubRequest(
      `/repos/${encodedRepo}/issues`,
      token,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: INCIDENT_TITLE,
          body: incidentBody(repository, runId, sha, monitorResult),
        }),
      }
    );
    if (!Number.isSafeInteger(created?.number)) {
      throw new Error("GitHub issue creation did not return an issue number");
    }
    console.log(`Opened hosted beta incident #${created.number}`);
    return;
  }

  if (!incident) {
    console.log("Hosted beta monitor is healthy; no open incident to reconcile");
    return;
  }

  await githubRequest(
    `/repos/${encodedRepo}/issues/${incident.number}/comments`,
    token,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        body: recoveryComment(repository, runId, sha),
      }),
    }
  );

  await githubRequest(
    `/repos/${encodedRepo}/issues/${incident.number}`,
    token,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "closed", state_reason: "completed" }),
    }
  );
  console.log(`Closed recovered hosted beta incident #${incident.number}`);
}

main().catch(error => {
  const message =
    error instanceof Error
      ? error.message
      : "unknown incident reconciliation error";
  console.error(`Hosted beta incident reconciliation failed: ${message}`);
  process.exitCode = 1;
});
