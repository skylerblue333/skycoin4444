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

function json(
  res: http.ServerResponse,
  status: number,
  body: unknown
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

async function createMockGitHub(openIncidentNumber?: number) {
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

    if (method === "GET" && url.pathname === "/search/issues") {
      json(res, 200, {
        items: openIncidentNumber
          ? [{ number: openIncidentNumber, title: INCIDENT_TITLE }]
          : [],
      });
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
        url.pathname
      )
    ) {
      json(res, 201, { id: 1234 });
      return;
    }

    if (
      method === "PATCH" &&
      /^\/repos\/skylerblue333\/skycoin4444\/issues\/\d+$/.test(
        url.pathname
      )
    ) {
      json(res, 200, { number: openIncidentNumber ?? 0, state: "closed" });
      return;
    }

    json(res, 404, { error: "unexpected request" });
  });

  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
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
  token = "token-that-must-not-leak"
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
        new Promise<void>(resolve => server.close(() => resolve()))
    )
  );
});

describe("hosted beta incident reconciler", () => {
  it("opens one bounded incident on the first monitor failure", async () => {
    const mock = await createMockGitHub();
    const token = "secret-monitor-token";
    const { stdout, stderr } = await runIncidentScript(
      mock.origin,
      "failure",
      token
    );

    expect(stderr).toBe("");
    expect(stdout).toContain("Opened hosted beta incident #900");

    const create = mock.requests.find(
      request =>
        request.method === "POST" &&
        request.pathname === "/repos/skylerblue333/skycoin4444/issues"
    );
    expect(create).toBeTruthy();
    expect(create?.authorization).toBe(`Bearer ${token}`);
    expect(create?.body).toMatchObject({ title: INCIDENT_TITLE });

    const body = (create?.body as { body?: string } | undefined)?.body ?? "";
    expect(body).toContain("failure");
    expect(body).toContain("a".repeat(40));
    expect(body).toContain("/actions/runs/123456");
    expect(body).not.toContain(token);
    expect(stdout + stderr).not.toContain(token);
  });

  it("deduplicates repeated failures while the incident is open", async () => {
    const mock = await createMockGitHub(777);
    const { stdout, stderr } = await runIncidentScript(mock.origin, "failure");

    expect(stderr).toBe("");
    expect(stdout).toContain(
      "Hosted beta incident already open as #777; no duplicate created"
    );
    expect(
      mock.requests.filter(request => request.method !== "GET")
    ).toHaveLength(0);
  });

  it("comments on and closes the open incident after recovery", async () => {
    const mock = await createMockGitHub(778);
    const { stdout, stderr } = await runIncidentScript(mock.origin, "success");

    expect(stderr).toBe("");
    expect(stdout).toContain("Closed recovered hosted beta incident #778");

    const comment = mock.requests.find(
      request =>
        request.method === "POST" &&
        request.pathname.endsWith("/issues/778/comments")
    );
    const close = mock.requests.find(
      request =>
        request.method === "PATCH" &&
        request.pathname.endsWith("/issues/778")
    );

    expect(comment?.body).toMatchObject({
      body: expect.stringContaining("Automated recovery observed"),
    });
    expect(close?.body).toEqual({
      state: "closed",
      state_reason: "completed",
    });
  });
});
