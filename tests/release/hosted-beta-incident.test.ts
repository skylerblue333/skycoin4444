import http from "node:http";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const INCIDENT_TITLE = "[ops] Hosted beta health monitor incident";
const servers: http.Server[] = [];

type RequestRecord = {
  method: string;
  pathname: string;
  body: unknown;
  authorization: string;
};

type ExistingIncident = {
  number: number;
  body: string;
  page?: number;
};

function json(
  res: http.ServerResponse,
  status: number,
  body: unknown,
) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(body));
}

async function readJson(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : null;
}

function incidentBody(count: number, firstSha = "b".repeat(40)) {
  return [
    "<!-- skycoin-hosted-beta-incident:v1 -->",
    `<!-- consecutive-failures:${count} -->`,
    `<!-- first-failure-sha:${firstSha} -->`,
    "",
    "existing incident",
  ].join("\n");
}

async function createMockGitHub(existing?: ExistingIncident) {
  const requests: RequestRecord[] = [];
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const authorization = req.headers.authorization ?? "";
    let body: unknown = null;

    if (method !== "GET") {
      body = await readJson(req);
    }

    requests.push({
      method,
      pathname: url.pathname,
      body,
      authorization,
    });

    if (
      method === "GET" &&
      url.pathname === "/repos/skylerblue333/skycoin4444/issues"
    ) {
      const page = Number(url.searchParams.get("page") ?? "1");
      const targetPage = existing?.page ?? 1;

      if (existing && page === targetPage) {
        json(res, 200, [
          {
            number: existing.number,
            title: INCIDENT_TITLE,
            body: existing.body,
          },
        ]);
        return;
      }

      if (existing && page < targetPage) {
        json(
          res,
          200,
          Array.from({ length: 100 }, (_, index) => ({
            number: page * 1000 + index,
            title: `unrelated issue ${page}-${index}`,
          })),
        );
        return;
      }

      json(res, 200, []);
      return;
    }

    if (
      method === "POST" &&
      url.pathname === "/repos/skylerblue333/skycoin4444/issues"
    ) {
      json(res, 201, { number: 900 });
      return;
    }

    if (
      method === "POST" &&
      /^\/repos\/skylerblue333\/skycoin4444\/issues\/\d+\/comments$/.test(
        url.pathname,
      )
    ) {
      json(res, 201, { id: 1234 });
      return;
    }

    if (
      method === "PATCH" &&
      /^\/repos\/skylerblue333\/skycoin4444\/issues\/\d+$/.test(
        url.pathname,
      )
    ) {
      json(res, 200, {
        number: existing?.number ?? 0,
        state: (body as { state?: string } | null)?.state ?? "open",
      });
      return;
    }

    json(res, 404, { error: "unexpected request" });
  });

  servers.push(server);
  await new Promise<void>(resolve =>
    server.listen(0, "127.0.0.1", resolve),
  );
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("mock GitHub server did not bind to a TCP port");
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    requests,
  };
}

async function runIncidentScript(
  origin: string,
  monitorResult: string,
  token = "token-that-must-not-leak",
) {
  const script = path.resolve("scripts/hosted-beta-incident.mjs");
  return execFileAsync(process.execPath, [script], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      GITHUB_API_URL: origin,
      GITHUB_SERVER_URL: "https://github.example.test",
      GITHUB_TOKEN: token,
      GITHUB_REPOSITORY: "skylerblue333/skycoin4444",
      GITHUB_RUN_ID: "123456",
      GITHUB_SHA: "a".repeat(40),
      HOSTED_BETA_MONITOR_RESULT: monitorResult,
    },
  });
}

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      server =>
        new Promise<void>(resolve => server.close(() => resolve())),
    ),
  );
});

describe("hosted beta incident reconciler", () => {
  it("opens an assigned SEV-3 incident on the first monitor failure", async () => {
    const mock = await createMockGitHub();
    const token = "secret-monitor-token";
    const { stdout, stderr } = await runIncidentScript(
      mock.origin,
      "failure",
      token,
    );

    expect(stderr).toBe("");
    expect(stdout).toContain("Opened hosted beta incident #900 (SEV-3)");

    const create = mock.requests.find(
      request =>
        request.method === "POST" &&
        request.pathname === "/repos/skylerblue333/skycoin4444/issues",
    );
    expect(create).toBeTruthy();
    expect(create?.authorization).toBe(`Bearer ${token}`);
    expect(create?.body).toMatchObject({
      title: INCIDENT_TITLE,
      assignees: ["skylerblue333"],
    });

    const body = (create?.body as { body?: string } | undefined)?.body ?? "";
    expect(body).toContain("<!-- consecutive-failures:1 -->");
    expect(body).toContain("Severity: **SEV-3**");
    expect(body).toContain("Consecutive monitor failures: **1**");
    expect(body).toContain("@skylerblue333");
    expect(body).toContain("/actions/runs/123456");
    expect(body).not.toContain(token);
    expect(stdout + stderr).not.toContain(token);
  });

  it.each(["cancelled", "skipped"])(
    "leaves incident state untouched for %s monitor outcomes",
    async monitorResult => {
      const mock = await createMockGitHub({
        number: 776,
        body: incidentBody(2),
      });

      const { stdout, stderr } = await runIncidentScript(
        mock.origin,
        monitorResult,
      );

      expect(stderr).toBe("");
      expect(stdout).toContain(
        `Hosted beta monitor result is ${monitorResult}; incident state left unchanged`,
      );
      expect(mock.requests).toHaveLength(0);
    },
  );

  it("updates repeated failures without opening duplicate incidents", async () => {
    const mock = await createMockGitHub({
      number: 777,
      body: incidentBody(1),
      page: 2,
    });

    const { stdout, stderr } = await runIncidentScript(
      mock.origin,
      "failure",
    );

    expect(stderr).toBe("");
    expect(stdout).toContain(
      "Updated hosted beta incident #777: 2 consecutive failures (SEV-3)",
    );

    const reads = mock.requests.filter(
      request =>
        request.method === "GET" &&
        request.pathname === "/repos/skylerblue333/skycoin4444/issues",
    );
    expect(reads).toHaveLength(2);

    const update = mock.requests.find(
      request =>
        request.method === "PATCH" &&
        request.pathname.endsWith("/issues/777"),
    );
    expect(update?.body).toMatchObject({
      assignees: ["skylerblue333"],
      body: expect.stringContaining("<!-- consecutive-failures:2 -->"),
    });

    const creates = mock.requests.filter(
      request =>
        request.method === "POST" &&
        request.pathname === "/repos/skylerblue333/skycoin4444/issues",
    );
    expect(creates).toHaveLength(0);

    const comments = mock.requests.filter(request =>
      request.pathname.endsWith("/issues/777/comments"),
    );
    expect(comments).toHaveLength(0);
  });

  it("adds one escalation comment when the failure streak crosses into SEV-2", async () => {
    const mock = await createMockGitHub({
      number: 778,
      body: incidentBody(2),
    });

    const { stdout, stderr } = await runIncidentScript(
      mock.origin,
      "failure",
    );

    expect(stderr).toBe("");
    expect(stdout).toContain(
      "Updated hosted beta incident #778: 3 consecutive failures (SEV-2)",
    );

    const update = mock.requests.find(
      request =>
        request.method === "PATCH" &&
        request.pathname.endsWith("/issues/778"),
    );
    const updatedBody =
      (update?.body as { body?: string } | undefined)?.body ?? "";
    expect(updatedBody).toContain("<!-- consecutive-failures:3 -->");
    expect(updatedBody).toContain("Severity: **SEV-2**");
    expect(updatedBody).toContain(
      "SEV-3 for failures 1-2, SEV-2 for failures 3-5, and SEV-1 for 6+",
    );

    const comment = mock.requests.find(
      request =>
        request.method === "POST" &&
        request.pathname.endsWith("/issues/778/comments"),
    );
    expect(comment?.body).toMatchObject({
      body: expect.stringContaining("Severity is now **SEV-2**"),
    });
  });

  it("comments on and closes the open incident after recovery", async () => {
    const mock = await createMockGitHub({
      number: 779,
      body: incidentBody(4),
    });

    const { stdout, stderr } = await runIncidentScript(
      mock.origin,
      "success",
    );

    expect(stderr).toBe("");
    expect(stdout).toContain(
      "Closed recovered hosted beta incident #779 after 4 consecutive failures",
    );

    const comment = mock.requests.find(
      request =>
        request.method === "POST" &&
        request.pathname.endsWith("/issues/779/comments"),
    );
    const close = mock.requests.find(
      request =>
        request.method === "PATCH" &&
        request.pathname.endsWith("/issues/779"),
    );

    expect(comment?.body).toMatchObject({
      body: expect.stringContaining("Prior consecutive failures: **4**"),
    });
    expect(close?.body).toEqual({
      state: "closed",
      state_reason: "completed",
    });
  });
});
