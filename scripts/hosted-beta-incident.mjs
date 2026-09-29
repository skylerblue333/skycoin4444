import process from "node:process";

const INCIDENT_TITLE = "[ops] Hosted beta health monitor incident";
const API_VERSION = "2022-11-28";
const ISSUE_PAGE_SIZE = 100;
const MAX_ISSUE_PAGES = 20;
const GITHUB_REQUEST_TIMEOUT_MS = 10_000;
const INCIDENT_MARKER = "<!-- skycoin-hosted-beta-incident:v1 -->";
const FAILURE_COUNT_PATTERN = /<!-- consecutive-failures:(\d+) -->/;
const FIRST_FAILURE_SHA_PATTERN = /<!-- first-failure-sha:([0-9a-f]{40}) -->/i;

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

function repositoryOwner(repository) {
  return repository.split("/", 1)[0];
}

function encodeRepository(repository) {
  return repository
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

function validatedOrigin(raw, name) {
  const url = new URL(raw.trim());
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(`${name} must be an HTTP(S) origin without credentials`);
  }
  return url.origin;
}

function apiOrigin() {
  return validatedOrigin(
    process.env.GITHUB_API_URL ?? "https://api.github.com",
    "GITHUB_API_URL"
  );
}

function serverOrigin() {
  return validatedOrigin(
    process.env.GITHUB_SERVER_URL ?? "https://github.com",
    "GITHUB_SERVER_URL"
  );
}

function runUrl(repository, runId) {
  return `${serverOrigin()}/${repository}/actions/runs/${runId}`;
}

async function githubRequest(path, token, init = {}) {
  const response = await fetch(apiOrigin() + path, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
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

function failureCountFromIncident(incident) {
  const body = typeof incident?.body === "string" ? incident.body : "";
  const match = body.match(FAILURE_COUNT_PATTERN);
  if (!match) return 1;
  const count = Number(match[1]);
  return Number.isSafeInteger(count) && count >= 1 ? count : 1;
}

function firstFailureShaFromIncident(incident, fallbackSha) {
  const body = typeof incident?.body === "string" ? incident.body : "";
  return body.match(FIRST_FAILURE_SHA_PATTERN)?.[1] ?? fallbackSha;
}

function severityForFailures(count) {
  if (count >= 6) return "SEV-1";
  if (count >= 3) return "SEV-2";
  return "SEV-3";
}

function incidentBody({
  repository,
  runId,
  latestSha,
  firstSha,
  result,
  failureCount,
}) {
  const severity = severityForFailures(failureCount);
  const owner = repositoryOwner(repository);

  return [
    INCIDENT_MARKER,
    `<!-- consecutive-failures:${failureCount} -->`,
    `<!-- first-failure-sha:${firstSha} -->`,
    "",
    "Automated engineering-beta monitor incident.",
    "",
    `- Severity: **${severity}**`,
    `- Consecutive monitor failures: **${failureCount}**`,
    `- Monitor result: **${result}**`,
    `- First failing source SHA: \`${firstSha}\``,
    `- Latest failing source SHA: \`${latestSha}\``,
    `- Latest workflow run: ${runUrl(repository, runId)}`,
    `- Assigned owner: @${owner}`,
    "",
    "Escalation policy: SEV-3 for failures 1-2, SEV-2 for failures 3-5, and SEV-1 for 6+ consecutive scheduled/manual monitor failures.",
    "",
    "The hosted-beta monitor failed its public health, readiness, authentication-configuration, safety-boundary, or exact-release check.",
    "",
    "This issue intentionally contains no invitation credentials, session tokens, provider secrets, or request bodies. Investigate the linked workflow and hosted deployment before calling the beta current.",
  ].join("\n");
}

function escalationComment(repository, runId, sha, failureCount) {
  return [
    "Automated hosted-beta alert escalation.",
    "",
    `- Severity is now **${severityForFailures(failureCount)}** after **${failureCount}** consecutive monitor failures.`,
    `- Latest failing source SHA: \`${sha}\``,
    `- Workflow run: ${runUrl(repository, runId)}`,
    "",
    "This is a repository-native engineering-beta escalation, not phone/SMS/pager delivery.",
  ].join("\n");
}

function recoveryComment(repository, runId, sha, failureCount) {
  return [
    "Automated recovery observed.",
    "",
    `- Healthy source SHA: \`${sha}\``,
    `- Workflow run: ${runUrl(repository, runId)}`,
    `- Prior consecutive failures: **${failureCount}**`,
    "",
    "The hosted-beta monitor returned to success, so this incident is being closed automatically.",
  ].join("\n");
}

async function updateIncident({
  repository,
  token,
  incident,
  runId,
  sha,
  monitorResult,
}) {
  const previousCount = failureCountFromIncident(incident);
  const nextCount = previousCount + 1;
  const firstSha = firstFailureShaFromIncident(incident, sha);
  const previousSeverity = severityForFailures(previousCount);
  const nextSeverity = severityForFailures(nextCount);
  const encodedRepo = encodeRepository(repository);

  await githubRequest(
    `/repos/${encodedRepo}/issues/${incident.number}`,
    token,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        body: incidentBody({
          repository,
          runId,
          latestSha: sha,
          firstSha,
          result: monitorResult,
          failureCount: nextCount,
        }),
        assignees: [repositoryOwner(repository)],
      }),
    }
  );

  if (previousSeverity !== nextSeverity) {
    await githubRequest(
      `/repos/${encodedRepo}/issues/${incident.number}/comments`,
      token,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          body: escalationComment(repository, runId, sha, nextCount),
        }),
      }
    );
  }

  console.log(
    `Updated hosted beta incident #${incident.number}: ${nextCount} consecutive failures (${nextSeverity})`
  );
}

async function main() {
  const token = required("GITHUB_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  validateRepository(repository);

  const monitorResult = required("HOSTED_BETA_MONITOR_RESULT").toLowerCase();
  if (monitorResult === "cancelled" || monitorResult === "skipped") {
    console.log(
      `Hosted beta monitor result is ${monitorResult}; incident state left unchanged`
    );
    return;
  }
  if (monitorResult !== "success" && monitorResult !== "failure") {
    throw new Error(
      "HOSTED_BETA_MONITOR_RESULT must be success, failure, cancelled, or skipped"
    );
  }

  const runId = required("GITHUB_RUN_ID");
  if (!/^\d+$/.test(runId)) {
    throw new Error("GITHUB_RUN_ID must contain only digits");
  }

  const sha = required("GITHUB_SHA");
  if (!/^[0-9a-f]{40}$/i.test(sha)) {
    throw new Error("GITHUB_SHA must be a full 40-character Git commit SHA");
  }

  const incident = await findOpenIncident(repository, token);
  const encodedRepo = encodeRepository(repository);

  if (monitorResult === "failure") {
    if (incident) {
      await updateIncident({
        repository,
        token,
        incident,
        runId,
        sha,
        monitorResult,
      });
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
          body: incidentBody({
            repository,
            runId,
            latestSha: sha,
            firstSha: sha,
            result: monitorResult,
            failureCount: 1,
          }),
          assignees: [repositoryOwner(repository)],
        }),
      }
    );
    if (!Number.isSafeInteger(created?.number)) {
      throw new Error("GitHub issue creation did not return an issue number");
    }
    console.log(`Opened hosted beta incident #${created.number} (SEV-3)`);
    return;
  }

  if (!incident) {
    console.log("Hosted beta monitor is healthy; no open incident to reconcile");
    return;
  }

  const priorFailureCount = failureCountFromIncident(incident);

  await githubRequest(
    `/repos/${encodedRepo}/issues/${incident.number}/comments`,
    token,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        body: recoveryComment(
          repository,
          runId,
          sha,
          priorFailureCount
        ),
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
  console.log(
    `Closed recovered hosted beta incident #${incident.number} after ${priorFailureCount} consecutive failures`
  );
}

main().catch(error => {
  const message =
    error instanceof Error
      ? error.message
      : "unknown incident reconciliation error";
  console.error(`Hosted beta incident reconciliation failed: ${message}`);
  process.exitCode = 1;
});
